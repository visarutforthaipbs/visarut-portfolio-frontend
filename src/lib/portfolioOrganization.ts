import type { PortfolioItem } from "@/types/portfolio";
import { WordPressAPI } from "@/lib/wordpress";

// Fuzzy organization matcher dictionary
const ORGANIZATIONS_FUZZY: Record<string, string[]> = {
  "thai-pbs": ["thai pbs", "thaipbs", "ไทยพีบีเอส", "สื่อสาธารณะ", "สำนักเครือข่ายสื่อสาธารณะ", "ศูนย์สื่อชุมชน"],
  greenpeace: ["greenpeace", "กรีนพีซ"],
  realframe: ["realframe", "เรียลเฟรม"],
  lanna: ["lanna", "ล้านนา"],
  nation: ["nation", "เนชั่น"],
  ngo: ["มูลนิธิ", "foundation", "ngo", "สมาคม", "เครือข่าย", "องค์กร", "แรงงาน"],
};

export function matchOrganization(item: PortfolioItem, orgId: string): boolean {
  if (!orgId || orgId === "all") return true;

  const normalized = WordPressAPI.normalizePortfolio(item);
  const clientName = (normalized.meta.clientName || "").toLowerCase();

  const rawTitle = typeof item.title === "string" ? item.title : item.title?.rendered || "";
  const titleStr = rawTitle.toLowerCase();

  const rawExcerpt = item.excerpt ? (typeof item.excerpt === "string" ? item.excerpt : item.excerpt.rendered || "") : "";
  const excerptStr = rawExcerpt.toLowerCase();

  const acf = (item.acf || {}) as Record<string, unknown>;
  const organizationText = ["organization", "organization_name", "client_name", "client", "client_ngo", "project_description", "photo_description", "video_description", "editing_description", "campaign_description", "producer_description"]
    .map(key => typeof acf[key] === "string" ? (acf[key] as string).replace(/<[^>]*>/g, " ") : "")
    .join(" ").toLowerCase();
  const fullText = `${titleStr} ${excerptStr} ${clientName} ${organizationText}`;

  const aliases = ORGANIZATIONS_FUZZY[orgId.toLowerCase()] || [orgId.toLowerCase()];
  return aliases.some((alias) => /^[a-z -]+$/.test(alias)
    ? new RegExp(`(?:^|[^a-z])${alias}(?:$|[^a-z])`, "i").test(fullText)
    : fullText.includes(alias));
}
