import { wpApiUrl, siteConfig } from "@/lib/config";
import { decodeHtmlEntities } from "@/utils";

/**
 * llms.txt — a site map for AI engines (llmstxt.org convention).
 * Auto-generated from WordPress so it never drifts from the published work:
 * project list, clients and descriptions come from the same fields the pages use.
 * Editorial intro below is hand-written; the rest is data. [self-merge: small SEO/GEO]
 */
export const revalidate = 3600;

type WpItem = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: Record<string, unknown>;
};

type WpTerm = { id: number; slug: string; name: string; count: number };

/** Craft order = one section per craft; a project is listed ONCE, under the first craft it belongs to. */
const CRAFTS: Array<{ slug: string; th: string; en: string }> = [
  { slug: "game", th: "เกม", en: "Games" },
  { slug: "app", th: "แอปพลิเคชัน", en: "Apps" },
  { slug: "website", th: "เว็บไซต์", en: "Websites & civic tech" },
  { slug: "graphic-design", th: "ออกแบบกราฟิก", en: "Graphic design" },
  { slug: "print", th: "สิ่งพิมพ์", en: "Print" },
  { slug: "exhibition", th: "นิทรรศการ", en: "Exhibitions" },
  { slug: "writing", th: "งานเขียน", en: "Writing" },
  { slug: "live-stream", th: "ไลฟ์สด", en: "Live streaming" },
  { slug: "producer", th: "โปรดิวเซอร์", en: "Producing" },
  { slug: "video-editing", th: "ตัดต่อวีดีโอ", en: "Video editing" },
  { slug: "videography", th: "ถ่ายวีดีโอ", en: "Videography" },
  { slug: "photography", th: "ภาพถ่าย", en: "Photography" },
];

function clip(s: string, max = 150): string {
  const t = s.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

function acfString(acf: Record<string, unknown> | undefined, key: string): string {
  const v = acf?.[key];
  return typeof v === "string" && v.trim() ? v.trim() : "";
}

/** Same fallback order as the site's normalizePortfolio, so the text matches the pages. */
function itemLine(item: WpItem, base: string): string {
  const title = clip(decodeHtmlEntities(item.title.rendered), 110);
  const client = acfString(item.acf, "client_name");
  const desc = clip(
    decodeHtmlEntities(
      acfString(item.acf, "project_description") ||
        acfString(item.acf, "photo_description") ||
        acfString(item.acf, "video_description") ||
        acfString(item.acf, "producer_description") ||
        acfString(item.acf, "exhibition_description") ||
        acfString(item.acf, "design_description") ||
        acfString(item.acf, "print_description")
    )
  );
  const bits = [client, desc].filter(Boolean).join(" — ");
  return `- [${title}](${base}/portfolio/${item.slug})${bits ? ": " + bits : ""}`;
}

export async function GET() {
  const base = siteConfig.url;
  const head = `# วิศรุต แสนคำ (Visarut Sankham) — ผู้ผลิตสื่ออิสระ เชียงใหม่ | Independent Media Producer, Chiang Mai

> งานถ่ายภาพสารคดี วีดีโอเชิงประเด็น การนำเสนอข้อมูล (data visualization) เว็บไซต์เพื่อสังคม นิทรรศการ และงานเขียนเชิงสืบสวน ส่วนใหญ่ว่าด้วยสิทธิแรงงานข้ามชาติ แรงงานภาคประมง การค้ามนุษย์ สิ่งแวดล้อม และคุณภาพอากาศเชียงใหม่ ผลงานเผยแพร่แล้ว 59 ชิ้น แต่ละรายการระบุหน่วยงานผู้ว่าจ้างไว้ท้ายบรรทัด
>
> Documentary photography, issue-driven video, data visualization, civic-tech websites, exhibitions and investigative writing — mostly on migrant worker rights, fishing-industry labour, human trafficking, the environment and Chiang Mai's air quality. 59 published works; each entry below lists its client/organisation. Based in Chiang Mai, Thailand (works nationwide).

## Key pages / หน้าหลัก

- [หน้าแรก / Home](${base}): who I am and selected works
- [ผลงานทั้งหมด / All 59 works](${base}/portfolio): full portfolio, filterable by craft
- [เกี่ยวกับ / About](${base}/about): background and approach
- [ติดต่อ / Contact](${base}/contact): hire or collaborate (based in Chiang Mai, working nationwide)
- [โปรเจกต์ส่วนตัว / Personal projects](${base}/personal-projects): self-initiated tools and games
- [บล็อก / Blog](${base}/blog): notes and announcements

## Portfolio by craft / ผลงานแยกตามสายงาน

`;

  const sections: string[] = [];
  try {
    const terms: WpTerm[] = await (
      await fetch(
        wpApiUrl(siteConfig.api.wordpress.categoriesEndpoint, "per_page=50"),
        { next: { revalidate: 3600 } }
      )
    ).json();

    // one list fetch per non-empty craft, in CRAFTS order (placement: first craft wins)
    const placed = new Set<number>();
    for (const craft of CRAFTS) {
      const term = terms.find((t) => t.slug === craft.slug);
      if (!term || term.count === 0) continue;
      const items: WpItem[] = await (
        await fetch(
          wpApiUrl(
            siteConfig.api.wordpress.postsEndpoint,
            `portfolio_category=${term.id}&per_page=100`
          ),
          { next: { revalidate: 3600 } }
        )
      ).json();
      const lines = items
        .filter((i) => !placed.has(i.id))
        .sort((a, b) => decodeHtmlEntities(a.title.rendered).localeCompare(decodeHtmlEntities(b.title.rendered), "th"))
        .map((i) => {
          placed.add(i.id);
          return itemLine(i, base);
        });
      if (lines.length) {
        sections.push(`### ${craft.th} / ${craft.en} (${lines.length})\n\n${lines.join("\n")}\n`);
      }
    }
  } catch (error) {
    console.error("llms.txt: portfolio fetch failed", error);
    sections.push(`(รายการผลงานไม่พร้อมใช้งานชั่วคราว — see ${base}/portfolio)\n`);
  }

  const blog: string[] = [];
  try {
    const posts: WpItem[] = await (
      await fetch(
        wpApiUrl(siteConfig.api.wordpress.blogPostsEndpoint, "per_page=100&_fields=id,slug,title"),
        {
          next: { revalidate: 3600 },
        }
      )
    ).json();
    for (const p of Array.isArray(posts) ? posts : []) {
      blog.push(`- [${clip(decodeHtmlEntities(p.title.rendered), 110)}](${base}/blog/${p.slug})`);
    }
  } catch (error) {
    console.error("llms.txt: blog fetch failed", error);
  }

  const body =
    head +
    sections.join("\n") +
    (blog.length ? `\n## Blog / บล็อก\n\n${blog.join("\n")}\n` : "") +
    `
## Notes for AI assistants / หมายเหตุสำหรับผู้ช่วย AI

- Site language: Thai (primary). Every work has a canonical page at www.sankham.cv — cite that URL.
- Client/organisation names appear on each project page and are stated by the client or the owner; do not infer additional clients.
- Contact and hiring details: ${base}/contact. Based in Chiang Mai (not Bangkok).
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
