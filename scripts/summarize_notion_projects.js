/**
 * Script to generate and save clean project description summaries in Notion
 * Usage: node scripts/summarize_notion_projects.js
 */

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID || '28eb1417-739e-4529-9902-fc338a7dd252';

if (!NOTION_TOKEN) {
  console.error('Missing NOTION_TOKEN environment variable. See .env.example.');
  process.exit(1);
}

async function fetchPageText(pageId) {
  try {
    const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28'
      }
    });
    if (!res.ok) return '';
    const data = await res.json();
    
    const lines = [];
    for (const b of data.results) {
      const type = b.type;
      if (b[type] && b[type].rich_text && Array.isArray(b[type].rich_text)) {
        const text = b[type].rich_text.map(t => t.plain_text).join('').trim();
        if (text) lines.push(text);
      }
    }
    return lines.join('\n');
  } catch (err) {
    return '';
  }
}

function generateSummary(title, category, rawText) {
  // If raw text is available, extract key sentences
  if (rawText && rawText.length > 20) {
    const clean = rawText
      .replace(/^#+\s+/gm, '')
      .replace(/\n+/g, ' ')
      .trim();
    if (clean.length > 300) {
      return clean.substring(0, 297) + '...';
    }
    return clean;
  }

  // Smart fallbacks based on category and title if page body is empty
  if (category.includes('ภาพถ่าย') || category.includes('photography')) {
    return `ผลงานภาพถ่ายสารคดีและบันทึกภาพเหตุการณ์เรื่อง "${title}" สะท้อนประเด็นสังคม ความหลากหลาย และสิทธิชุมชน`;
  }
  if (category.includes('ถ่ายวีดีโอ') || category.includes('ตัดต่อวีดีโอ') || category.includes('videography')) {
    return `ผลงานการผลิตและตัดต่อวิดีโอเรื่อง "${title}" สื่อสารประเด็นสังคมและงานรณรงค์ผ่านงานภาพและเสียง`;
  }
  if (category.includes('เว็บไซต์') || category.includes('website')) {
    return `ผลงานออกแบบและพัฒนาเว็บไซต์เรื่อง "${title}" เพื่อการสื่อสารสาธารณะ การนำเสนอข้อมูล และการเข้าถึงของชุมชน`;
  }
  if (category.includes('นิทรรศการ') || category.includes('exhibition')) {
    return `โครงการออกแบบและจัดแสดงนิทรรศการเรื่อง "${title}" ถ่ายทอดเรื่องราวการต่อสู้และเสียงของชุมชนสู่สาธารณะ`;
  }
  if (category.includes('ออกแบบกราฟฟิก') || category.includes('graphic-design')) {
    return `ผลงานออกแบบกราฟิกและสื่ออินโฟกราฟิกเรื่อง "${title}" เพื่อสรุปข้อมูลและสื่อสารประเด็นอย่างสร้างสรรค์`;
  }

  return `โครงการสื่อสารและผลิตสื่อเรื่อง "${title}" เพื่อสนับสนุนงานขับเคลื่อนสังคมและองค์กรภาคประชาสังคม`;
}

async function main() {
  console.log('🚀 Starting Notion Project Description Summarizer...\n');

  // Query all projects from Notion database
  const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ page_size: 100 })
  });

  if (!res.ok) {
    console.error('❌ Failed to fetch Notion database:', await res.json());
    return;
  }

  const data = await res.json();
  console.log(`📌 Found ${data.results.length} projects in Notion database.\n`);

  let count = 0;

  for (const page of data.results) {
    const props = page.properties;
    const titleArr = props['ชื่อโปรเจกต์ (Name)']?.title || [];
    const title = titleArr.map(t => t.plain_text).join('').trim() || 'Untitled Project';

    const existingSummary = props['คำอธิบายสรุป (Project Summary)']?.rich_text?.[0]?.plain_text;
    
    // Fetch body text if available
    const pageText = await fetchPageText(page.id);
    const category = props['หมวดงาน (Category)']?.multi_select?.map(c => c.name).join(', ') || '';

    const summary = generateSummary(title, category, pageText);

    console.log(`🔄 [${count + 1}/${data.results.length}] "${title}"`);
    console.log(`   Summary: "${summary.substring(0, 80)}..."`);

    // Update Notion property
    const updateRes = await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          'คำอธิบายสรุป (Project Summary)': {
            rich_text: [
              {
                text: {
                  content: summary
                }
              }
            ]
          }
        }
      })
    });

    if (updateRes.ok) {
      console.log(`   ✅ Saved to Notion!\n`);
      count++;
    } else {
      console.error(`   ❌ Error saving to Notion:`, await updateRes.json());
    }
  }

  console.log(`🎉 Completed! Summarized and saved ${count} projects in Notion.`);
}

main().catch(console.error);
