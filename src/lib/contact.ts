export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

interface ContactApiResponse {
  sent?: boolean;
  message?: string;
}

export async function submitContactForm(data: ContactFormData): Promise<void> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = (await response.json().catch(() => ({}))) as ContactApiResponse;

  if (!response.ok || !result.sent) {
    throw new Error(result.message || "ไม่สามารถส่งข้อความได้ในขณะนี้");
  }
}

export function createContactMailto(data: ContactFormData): string {
  const params = new URLSearchParams({
    subject: `[Portfolio] ${data.subject}`,
    body: `ชื่อ: ${data.name}\nอีเมล: ${data.email}\n\n${data.message}`,
  });

  return `mailto:visarut298@gmail.com?${params.toString()}`;
}
