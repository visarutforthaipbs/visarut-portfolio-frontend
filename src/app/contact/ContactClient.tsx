"use client";

import { ArrowRight, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/layout";
import Link from "next/link";
import { createContactMailto, submitContactForm } from "@/lib/contact";

export default function ContactClient({ initialSubject = "" }: { initialSubject?: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: initialSubject,
    message: "",
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      await submitContactForm(formData);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "", website: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "ไม่สามารถส่งข้อความได้ในขณะนี้"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-transparent border-b border-edge focus:border-content outline-none text-sm text-content py-3 placeholder:text-dim transition-colors";

  return (
    <Layout>
      <section
        className="bg-base flex justify-center w-full px-5 py-14 md:px-6 md:py-20"
        role="region"
        aria-label="ติดต่อ"
      >
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex max-w-2xl flex-col gap-4">
            <h1 className="text-3xl font-bold text-content tracking-tight md:text-5xl">
              ติดต่อ
            </h1>
            <p className="text-base text-muted leading-[1.8] md:text-lg">
              เล่าโจทย์งาน ภาพที่อยากสื่อ หรือรายละเอียดโปรเจกต์ได้เลย เราจะคุยกันให้ชัดก่อนเริ่มผลิตงาน
            </p>
          </div>
        </div>
      </section>

      <section
        className="bg-base flex justify-center w-full px-5 pb-16 md:px-6 md:pb-24"
        role="region"
        aria-label="ส่งข้อความ"
      >
        <div className="mx-auto grid w-full max-w-5xl gap-12 border-t border-edge pt-10 md:grid-cols-[minmax(0,1fr)_320px] md:gap-16 md:pt-14">
          <div className="flex min-w-0 flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-medium text-content md:text-xl">
                ส่งข้อความ
              </h2>
              <p className="max-w-xl text-sm leading-7 text-muted">
                ใช้ฟอร์มนี้สำหรับงานถ่ายภาพ วิดีโอ เว็บไซต์ กราฟิก หรือโปรเจกต์สื่อสารที่ต้องการทีมผลิตเนื้อหา
              </p>
            </div>

            {submitStatus === "success" && (
              <div role="alert" aria-live="polite">
                <span className="text-sm text-green-500">
                  ส่งข้อความสำเร็จ เราจะติดต่อกลับโดยเร็ว
                </span>
              </div>
            )}

            {submitStatus === "error" && (
              <div role="alert" aria-live="polite">
                <span className="text-sm text-red-500">
                  {errorMessage}
                </span>
                <div>
                  <a
                    href={createContactMailto(formData)}
                    className="text-sm text-content underline underline-offset-4"
                  >
                    เปิดแอปอีเมลเพื่อส่งโดยตรง
                  </a>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex w-full flex-col gap-5">
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="website">เว็บไซต์</label>
                  <input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="sr-only">ชื่อ</label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="ชื่อ"
                    aria-label="ชื่อ"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="sr-only">อีเมล</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="อีเมล"
                    aria-label="อีเมล"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="sr-only">หัวข้อ</label>
                  <input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="หัวข้อ"
                    aria-label="หัวข้อ"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="sr-only">ข้อความ</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="ข้อความ"
                    aria-label="ข้อความ"
                    rows={5}
                    className={`${inputClass} resize-y`}
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex cursor-pointer items-center gap-2 border-b border-content pb-1 text-sm font-medium text-content transition-colors hover:text-muted hover:border-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "กำลังส่ง..." : "ส่งข้อความ"}</span>
                    <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          <aside
            className="flex min-w-0 flex-col gap-8 border-t border-edge pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0"
            aria-label="ช่องทางติดต่อ"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-medium text-content md:text-xl">
                ช่องทางติดต่อ
              </h2>
              <p className="text-sm leading-7 text-muted">
                ถ้าต้องการคุยเร็ว ส่งอีเมลหรือโทรได้โดยตรง
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <Link
                href="mailto:visarut298@gmail.com"
                className="group flex items-start gap-3 border-b border-edge pb-5"
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-content">
                  <Mail size={16} aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-sm text-muted">อีเมล</span>
                  <span className="break-words text-sm font-medium text-content transition-colors group-hover:text-muted md:text-[1rem]">
                    visarut298@gmail.com
                  </span>
                </span>
              </Link>

              <Link
                href="tel:+66627283058"
                className="group flex items-start gap-3 border-b border-edge pb-5"
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-content">
                  <Phone size={16} aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-sm text-muted">โทรศัพท์</span>
                  <span className="text-sm font-medium text-content transition-colors group-hover:text-muted md:text-[1rem]">
                    062-728-3058
                  </span>
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
