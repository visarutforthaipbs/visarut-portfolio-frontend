/**
 * Notion to WordPress Portfolio Sync Script
 * Usage: npm run sync-notion
 */

const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const NOTION_DB_ID = process.env.NOTION_DB_ID || '28eb1417-739e-4529-9902-fc338a7dd252';

const WP_URL = process.env.WP_URL || 'https://api.sankham.cv';
const WP_USER = process.env.WP_USER || 'visarutsankham';
const WP_PASS = process.env.WP_PASS || '';
const WP_AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

// Category mapping: Notion category name -> WordPress portfolio_category ID
const CATEGORY_MAP = {
  'ตัดต่อวีดีโอ': 23,
  'ถ่ายวีดีโอ': 24,
  'นิทรรศการ': 25,
  'ภาพถ่าย': 26,
  'สิ่งพิมพ์': 27,
  'ออกแบบกราฟฟิก': 28,
  'เว็บไซต์': 29,
  'แคมเปญ': 30,
  'โปรดิวเซอร์': 31,
  'ไลฟ์สด': 51,
  'อบรม': 52,
  'งานวิจัย': 53,
  'งานเขียน': 54,
};

/**
 * Fetch Client Name from Notion Client DB relation
 */
async function fetchClientName(clientPageId) {
  try {
    const res = await fetch(`https://api.notion.com/v1/pages/${clientPageId}`, {
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28'
      }
    });
    if (!res.ok) return null;
    const page = await res.json();
    const titleProp = page.properties['ชื่อบริษัท/องค์กร (Client Name)'] || page.properties['Name'] || Object.values(page.properties).find(p => p.type === 'title');
    return titleProp?.title?.[0]?.plain_text || null;
  } catch (err) {
    return null;
  }
}

/**
 * Fetch child blocks of a Notion page and convert them to HTML
 */
async function notionBlocksToHtml(blockId) {
  const res = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children?page_size=100`, {
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28'
    }
  });
  if (!res.ok) return '';
  const data = await res.json();
  const htmlChunks = [];

  for (const block of data.results) {
    switch (block.type) {
      case 'heading_1': {
        const text = block.heading_1.rich_text.map(t => t.plain_text).join('');
        if (text) htmlChunks.push(`<h1>${escapeHtml(text)}</h1>`);
        break;
      }
      case 'heading_2': {
        const text = block.heading_2.rich_text.map(t => t.plain_text).join('');
        if (text) htmlChunks.push(`<h2>${escapeHtml(text)}</h2>`);
        break;
      }
      case 'heading_3': {
        const text = block.heading_3.rich_text.map(t => t.plain_text).join('');
        if (text) htmlChunks.push(`<h3>${escapeHtml(text)}</h3>`);
        break;
      }
      case 'paragraph': {
        const textArr = block.paragraph.rich_text;
        if (textArr && textArr.length > 0) {
          const formatted = textArr.map(t => {
            let str = escapeHtml(t.plain_text);
            if (t.annotations.bold) str = `<strong>${str}</strong>`;
            if (t.annotations.italic) str = `<em>${str}</em>`;
            if (t.annotations.code) str = `<code>${str}</code>`;
            if (t.href) str = `<a href="${t.href}" target="_blank" rel="noopener noreferrer">${str}</a>`;
            return str;
          }).join('');
          htmlChunks.push(`<p>${formatted}</p>`);
        }
        break;
      }
      case 'bulleted_list_item': {
        const text = block.bulleted_list_item.rich_text.map(t => {
          let str = escapeHtml(t.plain_text);
          if (t.href) str = `<a href="${t.href}" target="_blank" rel="noopener noreferrer">${str}</a>`;
          return str;
        }).join('');
        if (text) htmlChunks.push(`<ul><li>${text}</li></ul>`);
        break;
      }
      case 'numbered_list_item': {
        const text = block.numbered_list_item.rich_text.map(t => t.plain_text).join('');
        if (text) htmlChunks.push(`<ol><li>${escapeHtml(text)}</li></ol>`);
        break;
      }
      case 'image': {
        const url = block.image.file?.url || block.image.external?.url;
        const caption = block.image.caption?.map(c => c.plain_text).join('') || '';
        if (url) {
          htmlChunks.push(`<figure><img src="${url}" alt="${escapeHtml(caption)}"${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}></figure>`);
        }
        break;
      }
      case 'embed': {
        const url = block.embed.url;
        if (url) htmlChunks.push(`<p><a href="${url}" target="_blank">${url}</a></p>`);
        break;
      }
      case 'video': {
        const url = block.video.file?.url || block.video.external?.url;
        if (url) htmlChunks.push(`<p><a href="${url}" target="_blank">${url}</a></p>`);
        break;
      }
      case 'divider': {
        htmlChunks.push('<hr />');
        break;
      }
    }
  }

  return htmlChunks.join('\n');
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Upload an image URL to WordPress Media Library
 */
async function uploadMediaToWordPress(imageUrl, filename = 'featured.jpg') {
  try {
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) return null;
    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await fetch(`${WP_URL}/?rest_route=/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${WP_AUTH}`,
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="${filename}"`
      },
      body: buffer
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      console.error('  ⚠️ Media upload failed:', err.message || err);
      return null;
    }
    const media = await uploadRes.json();
    console.log(`  📸 Uploaded Featured Media ID: ${media.id}`);
    return media.id;
  } catch (err) {
    console.error('  ⚠️ Error uploading media:', err.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Notion -> WordPress Sync...\n');

  // Query Notion items marked as "พร้อมเผยแพร่ (Ready to Publish)"
  const notionRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filter: {
        property: 'สถานะงาน (Work Status)',
        select: {
          equals: 'พร้อมเผยแพร่ (Ready to Publish)'
        }
      }
    })
  });

  if (!notionRes.ok) {
    const err = await notionRes.json();
    console.error('❌ Failed to query Notion:', err);
    return;
  }

  const data = await notionRes.json();
  console.log(`📌 Found ${data.results.length} items ready for publishing.\n`);

  if (data.results.length === 0) {
    console.log('💡 Tip: In Notion, change the "สถานะงาน (Work Status)" of any project to "พร้อมเผยแพร่ (Ready to Publish)", then run this script again!');
    return;
  }

  for (const page of data.results) {
    const props = page.properties;
    const titleArr = props['ชื่อโปรเจกต์ (Name)']?.title || [];
    const title = titleArr.map(t => t.plain_text).join('') || 'Untitled Project';

    console.log(`🔄 Processing: "${title}" (Notion ID: ${page.id})`);

    // 1. Get Categories
    const catOptions = props['หมวดงาน (Category)']?.multi_select || [];
    const wpCategoryIds = catOptions
      .map(c => CATEGORY_MAP[c.name])
      .filter(Boolean);

    console.log(`  Categories: ${catOptions.map(c => c.name).join(', ')} -> WP IDs: [${wpCategoryIds.join(', ')}]`);

    // 2. Resolve Client Name & Project Date
    let clientName = null;
    const clientRelation = props['ลูกค้า/องค์กร (Client/NGO)']?.relation?.[0];
    if (clientRelation) {
      clientName = await fetchClientName(clientRelation.id);
    }

    const projectDate = props['ระยะเวลางาน (Project Duration)']?.date?.start || null;
    const docUrl = props['เอกสาร (Documents)']?.url || null;

    // 3. Featured Image (Cover)
    let featuredMediaId = null;
    const coverUrl = page.cover?.file?.url || page.cover?.external?.url;
    if (coverUrl) {
      featuredMediaId = await uploadMediaToWordPress(coverUrl, `cover-${page.id.substring(0,8)}.jpg`);
    }

    // 4. Convert Body Blocks to HTML
    const contentHtml = await notionBlocksToHtml(page.id);

    // 5. Create or Update WordPress Portfolio Post
    const existingWpId = props['WP Post ID']?.number;

    const postPayload = {
      title: title,
      content: contentHtml,
      status: 'publish',
      portfolio_category: wpCategoryIds,
      ...(featuredMediaId ? { featured_media: featuredMediaId } : {}),
      acf: {
        ...(clientName ? { client_name: clientName } : {}),
        ...(projectDate ? { project_date: projectDate } : {}),
        ...(docUrl ? { website_url: docUrl } : {})
      }
    };

    let wpPost = null;
    if (existingWpId) {
      console.log(`  Updating existing WP Post ID ${existingWpId}...`);
      const updateRes = await fetch(`${WP_URL}/?rest_route=/wp/v2/portfolios/${existingWpId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${WP_AUTH}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postPayload)
      });
      if (updateRes.ok) {
        wpPost = await updateRes.json();
      }
    }

    if (!wpPost) {
      console.log(`  Creating new WP Post...`);
      const createRes = await fetch(`${WP_URL}/?rest_route=/wp/v2/portfolios`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${WP_AUTH}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postPayload)
      });
      if (!createRes.ok) {
        const err = await createRes.json();
        console.error('  ❌ Error creating WP Post:', err);
        continue;
      }
      wpPost = await createRes.json();
    }

    const publishedUrl = `https://www.sankham.cv/portfolio/${wpPost.slug}`;
    console.log(`  ✅ Published to WP Post ID ${wpPost.id}: ${publishedUrl}`);

    // 6. Update Notion page status to "เผยแพร่แล้ว (Published)" and record WP Post ID & URL
    await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          'สถานะงาน (Work Status)': {
            select: { name: 'เผยแพร่แล้ว (Published)' }
          },
          'WP Post ID': {
            number: wpPost.id
          },
          'WP URL': {
            url: publishedUrl
          }
        }
      })
    });

    console.log(`  ✅ Notion page updated to "เผยแพร่แล้ว (Published)".\n`);
  }

  console.log('🎉 Notion -> WordPress Sync completed successfully!');
}

main().catch(console.error);
