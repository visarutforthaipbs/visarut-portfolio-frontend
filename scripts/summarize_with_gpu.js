/**
 * Enhanced GPU LLM Project Summarizer with Full Pagination (RTX 3090 + Typhoon2 8B)
 * Processes ALL projects in Notion database (no 100 item limit).
 * Usage: node scripts/summarize_with_gpu.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const NOTION_DB_ID = process.env.NOTION_DB_ID || '28eb1417-739e-4529-9902-fc338a7dd252';

const TEMP_FILE = path.join(os.tmpdir(), 'llm_payload.json');

/**
 * Call local GPU LLM (Typhoon2 8b) via SSH using OS temp file piping
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
    
    const output = execSync(cmd, { encoding: 'utf8', timeout: 40000 });
    const json = JSON.parse(output);
    return json.response?.trim() || null;
  } catch (err) {
    console.error('  ⚠️ GPU LLM Call Failed:', err.message);
    return null;
  }
}

/**
 * Recursively fetch text content from Notion page blocks (including columns, callouts & toggles)
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
        // Exclude lines that are clearly budget/financial admin notes
        if (text && !/^(งบประมาณ|ค่าจ้าง|ค่าตอบแทน|บาท|budget|cost|price|deadline|contact person)/i.test(text)) {
          textChunks.push(text);
        }
      }
      
      // Traverse child blocks
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

/**
 * Quality check filter: Return true if summary needs improvement
 */
function needsImprovement(summary) {
  if (!summary) return true;
  if (summary.length < 35) return true;
  // Check for admin/financial leakages
  if (/(งบประมาณ|ค่าตอบแทน|บาท|baht|USD|บาท\/|ค่าจ้าง|deadline|contact person|พี่|โทร)/i.test(summary)) return true;
  // Check for incomplete cut-offs
  if (/^(The|A|An|Project|Work|Title)\s*$/i.test(summary)) return true;
  return false;
}

function buildPrompt(title, category, clientName, pageText, isRetry = false) {
  const cleanBody = (pageText || '').substring(0, 1500);

  if (isRetry || !cleanBody || cleanBody.length < 20) {
    return `คุณคือผู้เขียนบรรณาธิการสื่อและนักพัฒนาเว็บ จงเขียนคำอธิบายผลงานสำหรับจัดแสดงบนพอร์ตโฟลิโอเว็บไซต์สาธารณะ

ข้อมูลผลงาน:
- ชื่อโปรเจกต์: "${title}"
- หมวดหมู่: "${category || 'สื่อสารมวลชน'}"
${clientName ? `- องค์กร/ผู้ว่าจ้าง: "${clientName}"` : ''}

คำสั่ง:
เขียนสรุปภาพรวมผลงานนี้เป็นภาษาไทย ความยาว 2 ประโยค ให้ได้ใจความ สละสลวย น่าอ่าน และเป็นมืออาชีพ
ข้อห้ามเด็ดขาด: ห้ามใส่ตัวเลขงบประมาณ ห้ามใส่ค่าตอบแทน ห้ามใส่ชื่อติดต่อภายใน ห้ามใส่คำว่า deadline หรือข้อมูลการเงิน

ตอบเฉพาะเนื้อหาสรุปภาษาไทย 2 ประโยค:`;
  }

  return `คุณคือบรรณาธิการสื่อสารมวลชนและผู้เชี่ยวชาญการเขียน Portfolio

ผลงานเรื่อง: "${title}" (หมวดหมู่: "${category || 'สื่อ'}")
${clientName ? `องค์กรผู้ว่าจ้าง: "${clientName}"` : ''}

รายละเอียดและเนื้อหาหลัก:
${cleanBody}

คำสั่ง:
จงเขียนสรุปภาพรวมผลงานนี้เป็นภาษาไทย ความยาว 2 ประโยค สำหรับแสดงบนหน้าพอร์ตโฟลิโอสาธารณะ โดยอธิบายว่าผลงานนี้คืออะไร ทำเรื่องอะไร และมีคุณค่าหรือความสำคัญอย่างไรต่อสังคมและผู้ดู

ข้อห้ามเด็ดขาด:
1. ห้ามใส่ตัวเลขงบประมาณ จำนวนเงิน หรือค่าตอบแทน
2. ห้ามใส่ชื่อบุคคลติดต่อภายใน หรือหมายเหตุแอดมิน
3. ตอบเฉพาะเนื้อหาสรุปภาษาไทย 2 ประโยคสั้นกระชับ ไม่ต้องมีคำเกริ่นนำ

สรุปภาษาไทย:`;
}

/**
 * Fetch ALL pages from Notion database using pagination
 */
async function fetchAllNotionPages() {
  let allPages = [];
  let hasMore = true;
  let startCursor = undefined;

  while (hasMore) {
    const body = { page_size: 100 };
    if (startCursor) body.start_cursor = startCursor;

    const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      console.error('❌ Failed to fetch Notion database page chunk:', await res.json());
      break;
    }

    const data = await res.json();
    allPages = allPages.concat(data.results);
    hasMore = data.has_more;
    startCursor = data.next_cursor;
  }

  return allPages;
}

async function main() {
  console.log('🚀 Starting Full GPU LLM Project Summarization (All Notion Projects, No Page Limits)...\n');

  const pages = await fetchAllNotionPages();
  console.log(`📌 Found a total of ${pages.length} projects across all pages in Notion database.\n`);

  let count = 0;
  let improvedCount = 0;

  for (const page of pages) {
    const props = page.properties;
    const titleArr = props['ชื่อโปรเจกต์ (Name)']?.title || [];
    const title = titleArr.map(t => t.plain_text).join('').trim() || 'Untitled Project';

    const category = props['หมวดงาน (Category)']?.multi_select?.map(c => c.name).join(', ') || '';
    const clientName = props['ลูกค้า/องค์กร (Client/NGO)']?.relation?.[0]?.id || '';
    
    // Fetch page text
    const pageText = await fetchPageTextRecursive(page.id);

    // Initial prompt pass
    let prompt = buildPrompt(title, category, clientName, pageText, false);
    console.log(`🔄 [${count + 1}/${pages.length}] Processing: "${title}"`);
    
    let summary = callLocalGpuLlm(prompt);

    // Quality check retry
    if (needsImprovement(summary)) {
      console.log(`   ⚠️ Summary needed quality improvement, re-prompting Typhoon2...`);
      prompt = buildPrompt(title, category, clientName, pageText, true);
      summary = callLocalGpuLlm(prompt);
      improvedCount++;
    }

    if (summary) {
      summary = summary
        .replace(/^["'«“]/, '')
        .replace(/["'»”]$/, '')
        .replace(/^สรุป:\s*/, '')
        .replace(/^คำอธิบาย:\s*/, '')
        .trim();

      console.log(`   🤖 Portfolio Summary:\n      "${summary}"\n`);

      // Save directly to Notion
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

      if (updateRes.ok) count++;
    }
  }

  // Clean temp file
  if (fs.existsSync(TEMP_FILE)) {
    fs.unlinkSync(TEMP_FILE);
  }

  console.log(`\n🎉 Done! Successfully processed ALL ${count} projects in Notion (${improvedCount} quality-enhanced via Typhoon2).`);
}

main().catch(console.error);
