# Notion ➔ WordPress Data Mapping & Sync Architecture

This document describes how the **Notion Task Management Database**, **Headless WordPress REST API**, and **Next.js Portfolio Frontend** work together.

---

## 🏗️ 1. Architecture Overview

```mermaid
flowchart TD
    subgraph Notion ["1. Notion Task Management"]
        N_DB["ฐานข้อมูลรายรับและโปรเจกต์ (Income & Projects)"]
        N_Status["สถานะงาน: พร้อมเผยแพร่ (Ready to Publish)"]
    end

    subgraph Sync ["2. Sync Engine (Vercel Webhook + scripts/sync-notion.js fallback)"]
        Webhook["POST /api/notion-publish"]
        GHA["GitHub Actions (Hourly / Manual Dispatch)"]
        HTML["Notion Blocks ➔ HTML Converter"]
        Media["Cover Upload ➔ WP Media Library"]
    end

    subgraph WordPress ["3. Headless WordPress Backend"]
        WP_Post["POST /wp/v2/portfolios"]
        WP_Tax["Taxonomy: portfolio_category"]
        WP_ACF["Universal ACF Fields"]
    end

    subgraph Frontend ["4. Next.js Portfolio (sankham.cv)"]
        Normalize["WordPressAPI.normalizePortfolio()"]
        UI["Portfolio Catalog Components"]
    end

    N_DB -->|Filtered by Status| GHA
    N_Status -->|Notion automation webhook| Webhook
    Webhook --> HTML & Media
    GHA --> HTML & Media
    HTML & Media --> WP_Post
    WP_Post --> WP_Tax & WP_ACF
    WP_Post -->|Returns WP Post ID & URL| N_DB
    WP_Post --> Normalize --> UI
```

---

## 📊 2. Data Schema & Property Mapping Table

Every project in Notion maps directly to a WordPress `portfolios` post:

| Notion Property Name | Notion Type | WordPress Post Field | Description / Format |
| :--- | :--- | :--- | :--- |
| **`ชื่อโปรเจกต์ (Name)`** | `title` | `title` | Main title of the portfolio item |
| **`หมวดงาน (Category)`** | `multi_select` | `portfolio_category` | Array of WordPress Category IDs |
| **`Cover Image`** | `page.cover` | `featured_media` | Uploaded to WP Media Library; sets thumbnail ID |
| **Page Body (Blocks)** | `blocks` | `content` | Converted to clean HTML (headings, paragraphs, lists, embeds) |
| **`ลูกค้า/องค์กร (Client/NGO)`** | `relation` | `acf.client_name` | Resolved client/organization name |
| **`ระยะเวลางาน (Project Duration)`** | `date` | `acf.project_date` | Date or year of completion (`YYYY-MM-DD` or year) |
| **`เอกสาร (Documents)`** | `url` | `acf.external_url` | External project link, website URL, or video URL |
| **Page Body Summary** | `blocks` | `acf.project_description` | Short text overview snippet |
| **`WP Post ID`** | `number` | `id` | Saved back to Notion; prevents duplicates & enables updates |
| **`WP URL`** | `url` | `link` | Saved back to Notion; links to `https://www.sankham.cv/portfolio/slug` |

---

## 🏷️ 3. Category Taxonomy Mapping

The 13 categories in Notion map 1-to-1 with WordPress Category IDs and Frontend Slugs:

| Notion Category Name | WordPress Slug | WP Category ID |
| :--- | :--- | :--- |
| `ภาพถ่าย` | `photography` | `26` |
| `ถ่ายวีดีโอ` | `videography` | `24` |
| `ตัดต่อวีดีโอ` | `video-editing` | `23` |
| `เว็บไซต์` | `website` | `29` |
| `ออกแบบกราฟฟิก` | `graphic-design` | `28` |
| `นิทรรศการ` | `exhibition` | `25` |
| `สิ่งพิมพ์` | `print` | `27` |
| `แคมเปญ` | `campaign` | `30` |
| `โปรดิวเซอร์` | `producer` | `31` |
| `ไลฟ์สด` | `live-stream` | `51` |
| `อบรม` | `training` | `52` |
| `งานวิจัย` | `research` | `53` |
| `งานเขียน` | `writing` | `54` |

---

## 🎯 4. Simplified Universal ACF Schema

To eliminate friction, all portfolio items share a single **4-field universal ACF schema**:

```
Portfolio Universal Fields
├── client_name           (Text)      ➔ ลูกค้า / องค์กร
├── project_date          (Text)      ➔ วันที่ / ระยะเวลางาน
├── external_url          (URL)       ➔ ลิงก์โปรเจกต์ / ผลงาน
└── project_description   (Textarea)  ➔ คำอธิบายสรุป
```

---

## 🔄 5. Status Lifecycle & Sync Flow

1. **In Notion**: Change **`สถานะงาน (Work Status)`** to **`พร้อมเผยแพร่ (Ready to Publish)`** 🟦.
2. **Instant Sync Execution**: Notion automation sends a POST request to `https://www.sankham.cv/api/notion-publish`.
   - If the webhook payload includes a `pageId`, only that Notion page is checked and published.
   - If no `pageId` is provided, the endpoint immediately queries all rows marked `พร้อมเผยแพร่ (Ready to Publish)`.
3. **Fallback Sync Execution**: GitHub Actions still runs `scripts/sync-notion.js` hourly (or run `npm run sync-notion` manually) to catch anything missed by the webhook.
4. **WordPress Post Creation / Update**:
   - If **`WP Post ID`** is empty in Notion ➔ Creates a new post.
   - If **`WP Post ID`** exists ➔ Updates the existing post without creating duplicates.
5. **Notion Completion**:
   - **`สถานะงาน (Work Status)`** updates to **`เผยแพร่แล้ว (Published)`** 🟩.
   - **`WP Post ID`** and **`WP URL`** are written back to the Notion card.

### Instant Webhook Setup

1. Deploy the site to Vercel with the API route `POST /api/notion-publish`.
2. Add a new Vercel environment variable:

   ```
   NOTION_WEBHOOK_SECRET=<long random secret>
   ```

3. In Notion, create a database automation:
   - **Trigger**: `สถานะงาน (Work Status)` changes to `พร้อมเผยแพร่ (Ready to Publish)`.
   - **Action**: Send webhook / POST request.
   - **URL**: `https://www.sankham.cv/api/notion-publish`
   - **Header**: `x-notion-webhook-secret: <same secret>`
   - **Body**: preferably include the page id:

     ```json
     {
       "pageId": "{{Page ID}}"
     }
     ```

     If Notion cannot send the page id from your automation UI, send an empty JSON body. The endpoint will still immediately query every `พร้อมเผยแพร่ (Ready to Publish)` row.

### Notion Developer Webhook Verification

If you create a webhook subscription from the Notion Developers page instead of a database automation, use the full endpoint URL:

```
https://www.sankham.cv/api/notion-publish
```

Do not use `https://www.sankham.cv/`; the site root is a page, not the webhook handler, and Notion may show a `405`.

When Notion sends the verification request, `/api/notion-publish` returns HTTP 200 and logs the `verification_token`. Copy the token from the response or from Vercel Function logs, then paste it into Notion's **Verify subscription** dialog.

---

## 🔑 6. Required Environment Secrets

For GitHub Actions or local CLI sync, set the following environment variables:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `NOTION_TOKEN` | Notion API Integration Secret | `ntn_3589...` |
| `NOTION_DB_ID` | Notion Projects Database ID | `28eb1417739e45299902fc338a7dd252` |
| `WP_URL` | WordPress REST API Base URL | `https://api.sankham.cv` |
| `WP_USER` | WordPress Admin Username | `visarutsankham` |
| `WP_PASS` | WordPress Application Password | `xxxx xxxx xxxx xxxx xxxx xxxx` |
| `NOTION_WEBHOOK_SECRET` | Secret required by `/api/notion-publish` | `use-a-long-random-string` |

---

## 💻 7. Frontend Data Normalization ([`src/lib/wordpress.ts`](file:///Users/lighthouse-control/Documents/visarut-portfolio-frontend/src/lib/wordpress.ts))

When the Next.js app fetches posts from WordPress, `WordPressAPI.normalizePortfolio(item)` transforms any category item into a unified model:

```typescript
export interface StandardizedPortfolio {
  id: number;
  slug: string;
  title: string;
  category: PortfolioCategory;
  date: string;
  meta: {
    clientName?: string;
    projectDate?: string;
    description?: string;
    externalUrl?: string;
  };
  featuredImage?: ImageMedia;
  galleryImages: ImageMedia[];
  videos: VideoMedia[];
  specs: Array<{ label: string; value: string }>;
  rawItem: PortfolioItem;
}
```
