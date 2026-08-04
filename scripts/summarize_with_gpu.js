/**
 * Summarize Notion Projects using local RTX 3090 GPU (scb10x/llama3.1-typhoon2-8b-instruct)
 * Usage: node scripts/summarize_with_gpu.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID || '28eb1417-739e-4529-9902-fc338a7dd252';

if (!NOTION_TOKEN) {
  console.error('Missing NOTION_TOKEN environment variable. See .env.example.');
  process.exit(1);
}

const TEMP_FILE = path.join(os.tmpdir(), 'llm_payload.json');

/**
 * Call local GPU LLM (Typhoon2 8b) via SSH using file pipe to avoid shell escaping issues
 */
function callLocalGpuLlm(prompt) {
  try {
    const payload = JSON.stringify({
      model: 'scb10x/llama3.1-typhoon2-8b-instruct:latest',
      prompt: prompt,
      stream: false
    });

    fs.writeFileSync(TEMP_FILE, payload, 'utf8');

    const cmd = `cat "${TEMP_FILE}" | ssh gpu "curl -s http://localhost:11434/api/generate -d @-"`;
    
    const output = execSync(cmd, { encoding: 'utf8', timeout: 35000 });
    const json = JSON.parse(output);
    return json.response?.trim() || null;
  } catch (err) {
    console.error('  ⚠️ GPU LLM Error:', err.message);
    return null;
  }
}

/**
 * Recursively fetch text content from Notion page blocks (including columns & toggles)
 */
async function fetchPageTextRecursive(blockId, depth = 0) {
  if (depth > 3) return '';
  try {
    const res = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children?page_size=100`, {
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28'
      }
    });
    if (!res.ok) return '';
    const data = await res.json();
    
    let textChunks = [];
    for (const b of data.results) {
      const type = b.type;
      if (b[type] && b[type].rich_text && Array.isArray(b[type].rich_text)) {
        const text = b[type].rich_text.map(t => t.plain_text).join('').trim();
        if (text) textChunks.push(text);
      }
      
      // If block has children (e.g. columns, toggles, callouts), traverse deeper
      if (b.has_children && type !== 'child_database' && type !== 'child_page') {
        const childText = await fetchPageTextRecursive(b.id, depth + 1);
        if (childText) textChunks.push(childText);
      }
    }
    return textChunks.join('\n');
  } catch (err) {
    return '';
  }
}

async function main() {
  console.log('🚀 Starting GPU LLM Project Summarization (RTX 3090 + Typhoon2)...\n');

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
  console.log(`📌 Found ${data.results.length} projects to process.\n`);

  let count = 0;

  for (const page of data.results) {
    const props = page.properties;
    const titleArr = props['ชื่อโปรเจกต์ (Name)']?.title || [];
    const title = titleArr.map(t => t.plain_text).join('').trim() || 'Untitled Project';

    const category = props['หมวดงาน (Category)']?.multi_select?.map(c => c.name).join(', ') || 'สื่อ';
    
    // Fetch recursive block text from Notion
    const pageText = await fetchPageTextRecursive(page.id);

    const prompt = `คุณคือผู้ช่วยสรุปผลงานของผู้ผลิตสื่อ ชื่องาน: "${title}", หมวดหมู่: "${category}"

รายละเอียดข้อมูลในโปรเจกต์:
${pageText || title}

จงสรุปภาพรวมผลงานนี้เป็นภาษาไทย ความยาว 2 ประโยค ให้ได้ใจความ สั้นกระชับ ตรงประเด็น โดยอธิบายว่าผลงานนี้คืออะไร ทำเรื่องอะไร และมีความสำคัญอย่างไร (ตอบเฉพาะเนื้อหาสรุป):`;

    console.log(`🔄 [${count + 1}/${data.results.length}] Processing: "${title}"`);
    if (pageText) console.log(`   Text Extracted: ${pageText.substring(0, 100).replace(/\n/g, ' ')}...`);

    // Call GPU LLM
    let summary = callLocalGpuLlm(prompt);
    
    if (!summary) {
      console.log(`   ⚠️ LLM Retry needed for "${title}"...`);
      summary = callLocalGpuLlm(prompt);
    }

    if (summary) {
      // Clean leading/trailing quotes
      summary = summary.replace(/^["'«“]/, '').replace(/["'»”]$/, '').trim();
      console.log(`   🤖 GPU Typhoon2 Summary:\n      "${summary}"`);

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
  }

  // Cleanup temp payload file
  if (fs.existsSync(TEMP_FILE)) {
    fs.unlinkSync(TEMP_FILE);
  }

  console.log(`🎉 Completed! Successfully summarized ${count} projects using local RTX 3090 GPU!`);
}

main().catch(console.error);
