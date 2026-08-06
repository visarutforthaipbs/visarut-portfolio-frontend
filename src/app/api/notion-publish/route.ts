import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  publishNotionPageById,
  syncReadyPages,
  validateConfig,
  getConfig,
} from "@/lib/notionWordpressSync";

export const runtime = "nodejs";
export const maxDuration = 60;

function extractVerificationToken(body: unknown): string | null {
  if (typeof body !== "object" || body === null) return null;

  const token = (body as { verification_token?: unknown }).verification_token;
  return typeof token === "string" && token.startsWith("secret_") ? token : null;
}

function verifySecret(request: NextRequest, body: unknown): boolean {
  const expected = process.env.NOTION_WEBHOOK_SECRET;
  if (!expected) return false;

  const authHeader = request.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";
  const headerSecret =
    request.headers.get("x-notion-webhook-secret") ||
    request.headers.get("x-webhook-secret") ||
    bearer ||
    request.nextUrl.searchParams.get("secret");

  const bodySecret =
    typeof body === "object" && body !== null && "secret" in body
      ? String((body as { secret?: unknown }).secret || "")
      : "";

  return headerSecret === expected || bodySecret === expected;
}

function extractPageId(body: unknown): string | null {
  if (typeof body !== "object" || body === null) return null;

  const value = body as Record<string, unknown>;
  const direct =
    value.pageId ||
    value.page_id ||
    value.notionPageId ||
    value.notion_page_id ||
    value.id;

  if (typeof direct === "string" && direct.length >= 32) return direct;

  const page = value.page;
  if (typeof page === "object" && page !== null) {
    const pageId = (page as Record<string, unknown>).id;
    if (typeof pageId === "string" && pageId.length >= 32) return pageId;
  }

  return null;
}

function revalidatePortfolioPaths() {
  revalidatePath("/", "page");
  revalidatePath("/portfolio", "page");
  revalidatePath("/portfolio/[slug]", "page");
  revalidatePath("/portfolio/category/[category]", "page");
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const verificationToken = extractVerificationToken(body);

  if (verificationToken) {
    console.log("Notion webhook verification token:", verificationToken);
    return NextResponse.json({
      verified: false,
      message:
        "Copy verification_token from this response or Vercel logs and paste it into Notion.",
      verification_token: verificationToken,
    });
  }

  if (!verifySecret(request, body)) {
    return NextResponse.json({ published: false, message: "Invalid secret" }, { status: 401 });
  }

  const config = getConfig();
  const missing = validateConfig(config);
  if (missing.length) {
    return NextResponse.json(
      {
        published: false,
        message: `Missing required environment variables: ${missing.join(", ")}`,
      },
      { status: 500 }
    );
  }

  try {
    const pageId = extractPageId(body);
    const results = pageId
      ? [await publishNotionPageById(pageId, { config })]
      : await syncReadyPages({ config });

    const published = results.filter((result) => !result.skipped);
    if (published.length > 0) revalidatePortfolioPaths();

    return NextResponse.json({
      published: published.length > 0,
      mode: pageId ? "single-page" : "ready-query",
      count: published.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Notion publish webhook failed", error);
    return NextResponse.json(
      {
        published: false,
        message: error instanceof Error ? error.message : "Publish failed",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
