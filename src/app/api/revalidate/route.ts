import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { apiCache } from "@/lib/cache";
import { timingSafeEqual } from "crypto";

function isValidSecret(provided: string | null, expected?: string): boolean {
  if (!provided || !expected) return false;
  const bufProvided = Buffer.from(provided);
  const bufExpected = Buffer.from(expected);
  if (bufProvided.length !== bufExpected.length) return false;
  return timingSafeEqual(bufProvided, bufExpected);
}

/**
 * On-demand revalidation endpoint.
 * WordPress calls this via webhook (Webhooks plugin or custom code)
 * whenever a post/portfolio is published, updated, or trashed.
 *
 * Usage:
 *   POST /api/revalidate?secret=<REVALIDATE_SECRET>&type=blog
 *   POST /api/revalidate?secret=<REVALIDATE_SECRET>&type=portfolio
 *   POST /api/revalidate?secret=<REVALIDATE_SECRET>&type=all
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const type = request.nextUrl.searchParams.get("type") ?? "all";

  if (!isValidSecret(secret, process.env.REVALIDATE_SECRET)) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Invalidate in-memory REST API cache
    apiCache.clear();
    if (type === "blog" || type === "all") {
      revalidatePath("/blog", "page");
      revalidatePath("/blog/[slug]", "page");
      revalidatePath("/", "page"); // homepage has blog preview
    }

    if (type === "portfolio" || type === "all") {
      revalidatePath("/portfolio", "page");
      revalidatePath("/portfolio/[slug]", "page");
      revalidatePath("/portfolio/category/[category]", "page");
      revalidatePath("/", "page");
    }

    return NextResponse.json({
      revalidated: true,
      type,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 }
    );
  }
}

// Allow GET for easy browser testing (with secret)
export async function GET(request: NextRequest) {
  return POST(request);
}
