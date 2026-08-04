import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimits = new Map<string, RateLimitEntry>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);

  if (!entry || entry.resetAt <= now) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validatePayload(value: unknown):
  | { data: ContactPayload; error?: never }
  | { data?: never; error: string } {
  if (!isRecord(value)) return { error: "ข้อมูลแบบฟอร์มไม่ถูกต้อง" };

  const data: ContactPayload = {
    name: readString(value.name),
    email: readString(value.email).toLowerCase(),
    subject: readString(value.subject),
    message: readString(value.message),
    website: readString(value.website),
  };

  if (data.name.length < 2 || data.name.length > 100) {
    return { error: "กรุณาระบุชื่อให้ถูกต้อง" };
  }

  if (
    data.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    return { error: "กรุณาระบุอีเมลให้ถูกต้อง" };
  }

  if (data.subject.length < 2 || data.subject.length > 160) {
    return { error: "หัวข้อต้องมีความยาวระหว่าง 2–160 ตัวอักษร" };
  }

  if (data.message.length < 10 || data.message.length > 5000) {
    return { error: "ข้อความต้องมีความยาวระหว่าง 10–5,000 ตัวอักษร" };
  }

  return { data };
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { sent: false, message: "ส่งข้อความบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่" },
      { status: 429 }
    );
  }

  const parsed = validatePayload(await request.json().catch(() => null));
  if ("error" in parsed) {
    return NextResponse.json(
      { sent: false, message: parsed.error },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot: quietly accept bot submissions without sending email.
  if (data.website) {
    return NextResponse.json({ sent: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        sent: false,
        message: "ระบบส่งอีเมลยังไม่พร้อม กรุณาใช้อีเมลโดยตรงด้านล่าง",
      },
      { status: 503 }
    );
  }

  const to = process.env.CONTACT_TO_EMAIL || "visarut298@gmail.com";
  const from =
    process.env.CONTACT_FROM_EMAIL ||
    "Visarut Portfolio <onboarding@resend.dev>";
  const safeSubject = data.subject.replace(/[\r\n]+/g, " ");
  const text = [
    "มีข้อความใหม่จากเว็บไซต์ Portfolio",
    "",
    `ชื่อ: ${data.name}`,
    `อีเมล: ${data.email}`,
    `หัวข้อ: ${safeSubject}`,
    "",
    data.message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `[Portfolio] ${safeSubject}`,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    const result = (await response.json().catch(() => null)) as
      | { id?: string; message?: string }
      | null;

    if (!response.ok || !result?.id) {
      console.error("Contact email delivery failed", {
        status: response.status,
        providerMessage: result?.message,
      });
      return NextResponse.json(
        {
          sent: false,
          message: "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่หรือใช้อีเมลโดยตรง",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ sent: true, id: result.id });
  } catch (error) {
    console.error("Contact email request failed", error);
    return NextResponse.json(
      {
        sent: false,
        message: "ระบบส่งข้อความไม่ตอบสนอง กรุณาลองใหม่หรือใช้อีเมลโดยตรง",
      },
      { status: 504 }
    );
  }
}
