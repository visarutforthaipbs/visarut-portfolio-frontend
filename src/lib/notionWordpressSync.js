const READY_STATUS = "พร้อมเผยแพร่ (Ready to Publish)";
const PUBLISHED_STATUS = "เผยแพร่แล้ว (Published)";
const NOTION_VERSION = "2022-06-28";

const CATEGORY_MAP = {
  "ตัดต่อวีดีโอ": 23,
  "ถ่ายวีดีโอ": 24,
  "นิทรรศการ": 25,
  "ภาพถ่าย": 26,
  "สิ่งพิมพ์": 27,
  "ออกแบบกราฟฟิก": 28,
  "เว็บไซต์": 29,
  "แคมเปญ": 30,
  "โปรดิวเซอร์": 31,
  "ไลฟ์สด": 51,
  "อบรม": 52,
  "งานวิจัย": 53,
  "งานเขียน": 54,
};

function createLogger(logger = console) {
  return {
    log: logger.log?.bind(logger) || (() => {}),
    warn: logger.warn?.bind(logger) || logger.log?.bind(logger) || (() => {}),
    error: logger.error?.bind(logger) || logger.log?.bind(logger) || (() => {}),
  };
}

function getConfig() {
  const config = {
    notionToken: process.env.NOTION_TOKEN || "",
    notionDbId:
      process.env.NOTION_DB_ID || "28eb1417-739e-4529-9902-fc338a7dd252",
    wpUrl: process.env.WP_URL || "https://api.sankham.cv",
    wpUser: process.env.WP_USER || "visarutsankham",
    wpPass: process.env.WP_PASS || "",
  };

  config.wpAuth = Buffer.from(`${config.wpUser}:${config.wpPass}`).toString(
    "base64"
  );

  return config;
}

function validateConfig(config = getConfig()) {
  const missing = [];
  if (!config.notionToken) missing.push("NOTION_TOKEN");
  if (!config.notionDbId) missing.push("NOTION_DB_ID");
  if (!config.wpUrl) missing.push("WP_URL");
  if (!config.wpUser) missing.push("WP_USER");
  if (!config.wpPass) missing.push("WP_PASS");
  return missing;
}

function notionHeaders(config) {
  return {
    Authorization: `Bearer ${config.notionToken}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

function wpJsonHeaders(config) {
  return {
    Authorization: `Basic ${config.wpAuth}`,
    "Content-Type": "application/json",
  };
}

function escapeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pageTitle(page) {
  const titleArr = page.properties?.["ชื่อโปรเจกต์ (Name)"]?.title || [];
  return titleArr.map((t) => t.plain_text).join("") || "Untitled Project";
}

function pageStatus(page) {
  return page.properties?.["สถานะงาน (Work Status)"]?.select?.name || null;
}

async function fetchClientName(clientPageId, config) {
  try {
    const res = await fetch(`https://api.notion.com/v1/pages/${clientPageId}`, {
      headers: notionHeaders(config),
    });
    if (!res.ok) return null;

    const page = await res.json();
    const titleProp =
      page.properties["ชื่อบริษัท/องค์กร (Client Name)"] ||
      page.properties.Name ||
      Object.values(page.properties).find((property) => property.type === "title");

    return titleProp?.title?.[0]?.plain_text || null;
  } catch {
    return null;
  }
}

async function notionBlocksToHtml(blockId, config) {
  const res = await fetch(
    `https://api.notion.com/v1/blocks/${blockId}/children?page_size=100`,
    { headers: notionHeaders(config) }
  );
  if (!res.ok) return "";

  const data = await res.json();
  const htmlChunks = [];

  for (const block of data.results || []) {
    switch (block.type) {
      case "heading_1": {
        const text = block.heading_1.rich_text.map((t) => t.plain_text).join("");
        if (text) htmlChunks.push(`<h1>${escapeHtml(text)}</h1>`);
        break;
      }
      case "heading_2": {
        const text = block.heading_2.rich_text.map((t) => t.plain_text).join("");
        if (text) htmlChunks.push(`<h2>${escapeHtml(text)}</h2>`);
        break;
      }
      case "heading_3": {
        const text = block.heading_3.rich_text.map((t) => t.plain_text).join("");
        if (text) htmlChunks.push(`<h3>${escapeHtml(text)}</h3>`);
        break;
      }
      case "paragraph": {
        const textArr = block.paragraph.rich_text;
        if (textArr?.length) {
          const formatted = textArr
            .map((t) => {
              let str = escapeHtml(t.plain_text);
              if (t.annotations.bold) str = `<strong>${str}</strong>`;
              if (t.annotations.italic) str = `<em>${str}</em>`;
              if (t.annotations.code) str = `<code>${str}</code>`;
              if (t.href) {
                str = `<a href="${escapeHtml(t.href)}" target="_blank" rel="noopener noreferrer">${str}</a>`;
              }
              return str;
            })
            .join("");
          htmlChunks.push(`<p>${formatted}</p>`);
        }
        break;
      }
      case "bulleted_list_item": {
        const text = block.bulleted_list_item.rich_text
          .map((t) => {
            let str = escapeHtml(t.plain_text);
            if (t.href) {
              str = `<a href="${escapeHtml(t.href)}" target="_blank" rel="noopener noreferrer">${str}</a>`;
            }
            return str;
          })
          .join("");
        if (text) htmlChunks.push(`<ul><li>${text}</li></ul>`);
        break;
      }
      case "numbered_list_item": {
        const text = block.numbered_list_item.rich_text
          .map((t) => t.plain_text)
          .join("");
        if (text) htmlChunks.push(`<ol><li>${escapeHtml(text)}</li></ol>`);
        break;
      }
      case "image": {
        const url = block.image.file?.url || block.image.external?.url;
        const caption =
          block.image.caption?.map((c) => c.plain_text).join("") || "";
        if (url) {
          htmlChunks.push(
            `<figure><img src="${escapeHtml(url)}" alt="${escapeHtml(caption)}">${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>`
          );
        }
        break;
      }
      case "embed": {
        const url = block.embed.url;
        if (url) {
          htmlChunks.push(
            `<p><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></p>`
          );
        }
        break;
      }
      case "video": {
        const url = block.video.file?.url || block.video.external?.url;
        if (url) {
          htmlChunks.push(
            `<p><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></p>`
          );
        }
        break;
      }
      case "divider": {
        htmlChunks.push("<hr />");
        break;
      }
    }
  }

  return htmlChunks.join("\n");
}

async function uploadMediaToWordPress(imageUrl, filename, config, logger) {
  try {
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) return null;

    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await fetch(`${config.wpUrl}/?rest_route=/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${config.wpAuth}`,
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.json().catch(() => null);
      logger.warn("  ⚠️ Media upload failed:", err?.message || err);
      return null;
    }

    const media = await uploadRes.json();
    logger.log(`  📸 Uploaded Featured Media ID: ${media.id}`);
    return media.id;
  } catch (err) {
    logger.warn("  ⚠️ Error uploading media:", err.message);
    return null;
  }
}

async function fetchNotionPage(pageId, config = getConfig()) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: notionHeaders(config),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(`Failed to fetch Notion page: ${err?.message || res.status}`);
  }

  return res.json();
}

async function queryReadyPages(config = getConfig()) {
  const notionRes = await fetch(
    `https://api.notion.com/v1/databases/${config.notionDbId}/query`,
    {
      method: "POST",
      headers: notionHeaders(config),
      body: JSON.stringify({
        filter: {
          property: "สถานะงาน (Work Status)",
          select: {
            equals: READY_STATUS,
          },
        },
      }),
    }
  );

  if (!notionRes.ok) {
    const err = await notionRes.json().catch(() => null);
    throw new Error(`Failed to query Notion: ${err?.message || notionRes.status}`);
  }

  const data = await notionRes.json();
  return data.results || [];
}

async function publishNotionPage(page, options = {}) {
  const config = options.config || getConfig();
  const logger = createLogger(options.logger);
  const title = pageTitle(page);
  const status = pageStatus(page);

  if (options.requireReady !== false && status !== READY_STATUS) {
    logger.log(`⏭️ Skipping "${title}" because status is "${status || "empty"}".`);
    return {
      skipped: true,
      reason: "not_ready",
      notionPageId: page.id,
      title,
      status,
    };
  }

  logger.log(`🔄 Processing: "${title}" (Notion ID: ${page.id})`);

  const props = page.properties || {};
  const catOptions = props["หมวดงาน (Category)"]?.multi_select || [];
  const wpCategoryIds = catOptions
    .map((category) => CATEGORY_MAP[category.name])
    .filter(Boolean);

  logger.log(
    `  Categories: ${catOptions.map((c) => c.name).join(", ")} -> WP IDs: [${wpCategoryIds.join(", ")}]`
  );

  let clientName = null;
  const clientRelation = props["ลูกค้า/องค์กร (Client/NGO)"]?.relation?.[0];
  if (clientRelation) {
    clientName = await fetchClientName(clientRelation.id, config);
  }

  const projectDate = props["ระยะเวลางาน (Project Duration)"]?.date?.start || null;
  const docUrl = props["เอกสาร (Documents)"]?.url || null;
  const contentHtml = await notionBlocksToHtml(page.id, config);
  const plainSummary = contentHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);

  let featuredMediaId = null;
  const coverUrl = page.cover?.file?.url || page.cover?.external?.url;
  if (coverUrl) {
    featuredMediaId = await uploadMediaToWordPress(
      coverUrl,
      `cover-${page.id.substring(0, 8)}.jpg`,
      config,
      logger
    );
  }

  const existingWpId = props["WP Post ID"]?.number;
  const postPayload = {
    title,
    content: contentHtml,
    status: "publish",
    portfolio_category: wpCategoryIds,
    ...(featuredMediaId ? { featured_media: featuredMediaId } : {}),
    acf: {
      ...(clientName ? { client_name: clientName } : {}),
      ...(projectDate ? { project_date: projectDate } : {}),
      ...(docUrl ? { external_url: docUrl, website_url: docUrl } : {}),
      ...(plainSummary ? { project_description: plainSummary } : {}),
    },
  };

  let wpPost = null;
  if (existingWpId) {
    logger.log(`  Updating existing WP Post ID ${existingWpId}...`);
    const updateRes = await fetch(
      `${config.wpUrl}/?rest_route=/wp/v2/portfolios/${existingWpId}`,
      {
        method: "POST",
        headers: wpJsonHeaders(config),
        body: JSON.stringify(postPayload),
      }
    );

    if (updateRes.ok) {
      wpPost = await updateRes.json();
    } else {
      const err = await updateRes.json().catch(() => null);
      logger.warn("  ⚠️ Update failed, creating a new post instead:", err);
    }
  }

  if (!wpPost) {
    logger.log("  Creating new WP Post...");
    const createRes = await fetch(`${config.wpUrl}/?rest_route=/wp/v2/portfolios`, {
      method: "POST",
      headers: wpJsonHeaders(config),
      body: JSON.stringify(postPayload),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => null);
      throw new Error(`Error creating WP Post: ${JSON.stringify(err || createRes.status)}`);
    }

    wpPost = await createRes.json();
  }

  const publishedUrl = `https://www.sankham.cv/portfolio/${wpPost.slug}`;
  logger.log(`  ✅ Published to WP Post ID ${wpPost.id}: ${publishedUrl}`);

  const notionUpdateRes = await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
    method: "PATCH",
    headers: notionHeaders(config),
    body: JSON.stringify({
      properties: {
        "สถานะงาน (Work Status)": {
          select: { name: PUBLISHED_STATUS },
        },
        "WP Post ID": {
          number: wpPost.id,
        },
        "WP URL": {
          url: publishedUrl,
        },
      },
    }),
  });

  if (!notionUpdateRes.ok) {
    const err = await notionUpdateRes.json().catch(() => null);
    throw new Error(`Published to WordPress but failed to update Notion: ${err?.message || notionUpdateRes.status}`);
  }

  logger.log(`  ✅ Notion page updated to "${PUBLISHED_STATUS}".`);

  return {
    skipped: false,
    notionPageId: page.id,
    title,
    wpPostId: wpPost.id,
    slug: wpPost.slug,
    publishedUrl,
  };
}

async function publishNotionPageById(pageId, options = {}) {
  const config = options.config || getConfig();
  const page = await fetchNotionPage(pageId, config);
  return publishNotionPage(page, { ...options, config });
}

async function syncReadyPages(options = {}) {
  const config = options.config || getConfig();
  const logger = createLogger(options.logger);
  const missing = validateConfig(config);

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  const pages = await queryReadyPages(config);
  logger.log(`📌 Found ${pages.length} items ready for publishing.`);

  const results = [];
  for (const page of pages) {
    results.push(await publishNotionPage(page, { ...options, config }));
  }

  return results;
}

module.exports = {
  READY_STATUS,
  PUBLISHED_STATUS,
  getConfig,
  validateConfig,
  queryReadyPages,
  fetchNotionPage,
  publishNotionPage,
  publishNotionPageById,
  syncReadyPages,
};
