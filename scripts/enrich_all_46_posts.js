/**
 * Batch Enrich & Standardize All 46 Portfolio Posts in WordPress
 * Usage: node scripts/enrich_all_46_posts.js
 */

const WP_URL = process.env.WP_URL || 'https://api.sankham.cv';
const WP_USER = process.env.WP_USER || 'visarutsankham';
const WP_PASS = process.env.WP_PASS || '5YgZ WY2w o4e4 8G3c j8rD 1DhQ';
const WP_AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

function extractFirstLink(htmlContent) {
  if (!htmlContent) return null;
  
  // 1. Check for YouTube embed
  const ytMatch = htmlContent.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch) {
    return `https://www.youtube.com/watch?v=${ytMatch[1]}`;
  }

  // 2. Check for Vimeo embed
  const vimeoMatch = htmlContent.match(/(?:vimeo\.com\/)([0-9]+)/i);
  if (vimeoMatch) {
    return `https://vimeo.com/${vimeoMatch[1]}`;
  }

  // 3. Check for external anchor href links (excluding internal wp-content links)
  const hrefRegex = /<a[^>]+href="(https?:\/\/(?!api\.sankham\.cv|visarutsankham\.com)[^"]+)"[^>]*>/gi;
  let hrefMatch;
  while ((hrefMatch = hrefRegex.exec(htmlContent)) !== null) {
    const url = hrefMatch[1];
    if (!url.includes('gravatar.com') && !url.includes('w.org')) {
      return url;
    }
  }

  return null;
}

function extractDescriptionSnippet(htmlContent) {
  if (!htmlContent) return null;
  const cleanText = htmlContent
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleanText.length < 15) return null;
  return cleanText.length > 250 ? cleanText.substring(0, 247) + '...' : cleanText;
}

function formatDate(isoString) {
  if (!isoString) return '';
  const dateObj = new Date(isoString);
  if (isNaN(dateObj.getTime())) return isoString;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function main() {
  console.log('🚀 Starting Batch Enrichment for all 46 WordPress Portfolio Posts...\n');

  const res = await fetch(`${WP_URL}/?rest_route=/wp/v2/portfolios&per_page=100&_embed=true`, {
    headers: { 'Authorization': `Basic ${WP_AUTH}` }
  });

  if (!res.ok) {
    console.error('❌ Failed to fetch posts:', await res.json());
    return;
  }

  const posts = await res.json();
  console.log(`📌 Fetched ${posts.length} posts.\n`);

  let updatedCount = 0;

  for (const post of posts) {
    const acf = post.acf || {};

    // 1. Resolve client_name
    let clientName = acf.client_name || acf.client || acf.client_ngo || null;
    if (!clientName) {
      // Check content for known client names
      const content = post.content?.rendered || '';
      if (content.includes('Greenpeace') || content.includes('กรีนพีซ')) clientName = 'Greenpeace Thailand';
      else if (content.includes('Diakonia')) clientName = 'Diakonia';
      else if (content.includes('ประชาธรรม')) clientName = 'สำนักข่าวประชาธรรม';
      else if (content.includes('สภาลมหายใจ')) clientName = 'สภาลมหายใจเชียงใหม่';
    }

    // 2. Resolve project_date
    let projectDate = acf.project_date || acf.date || null;
    if (!projectDate && post.date) {
      projectDate = formatDate(post.date);
    }

    // 3. Resolve external_url
    let externalUrl = acf.external_url || acf.website_url || acf.video_url || acf.video_link || acf.github_url || null;
    if (!externalUrl) {
      externalUrl = extractFirstLink(post.content?.rendered);
    }

    // 4. Resolve project_description
    let projectDescription = acf.project_description || acf.photo_description || acf.video_description || acf.editing_description || acf.design_description || null;
    if (!projectDescription) {
      projectDescription = extractDescriptionSnippet(post.content?.rendered);
    }

    const payloadAcf = {
      ...(clientName ? { client_name: clientName } : {}),
      ...(projectDate ? { project_date: projectDate } : {}),
      ...(externalUrl ? { external_url: externalUrl } : {}),
      ...(projectDescription ? { project_description: projectDescription } : {})
    };

    console.log(`🔄 Updating Post ID ${post.id}: "${post.title?.rendered?.trim() || 'Untitled'}"`);
    console.log(`   Client: ${clientName || 'N/A'}`);
    console.log(`   Date: ${projectDate || 'N/A'}`);
    console.log(`   URL: ${externalUrl || 'N/A'}`);
    console.log(`   Description Snippet: ${projectDescription ? projectDescription.substring(0, 60) + '...' : 'N/A'}`);

    const updateRes = await fetch(`${WP_URL}/?rest_route=/wp/v2/portfolios/${post.id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${WP_AUTH}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ acf: payloadAcf })
    });

    if (updateRes.ok) {
      console.log(`   ✅ Post ID ${post.id} updated successfully.\n`);
      updatedCount++;
    } else {
      console.error(`   ❌ Failed to update Post ID ${post.id}:`, await updateRes.json());
    }
  }

  console.log(`🎉 Batch Enrichment Completed! ${updatedCount} / ${posts.length} posts updated successfully.`);
}

main().catch(console.error);
