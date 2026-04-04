"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/layout";
import Link from "next/link";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

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

    setTimeout(() => {
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1500);
  };

  const inputClass =
    "w-full bg-transparent border-b border-edge focus:border-content outline-none text-sm text-content py-3 placeholder:text-dim transition-colors";

  return (
    <Layout>
      {/* Hero */}
      <section
        className="bg-base py-20 md:py-28 flex justify-center w-full"
        role="region"
        aria-label="ติดต่อ"
      >
        <div className="max-w-3xl mx-auto px-5 md:px-6">
          <div className="flex flex-col gap-5 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-content tracking-tight">
              ติดต่อ
            </h1>
            <p className="text-base md:text-lg text-muted leading-[1.8] max-w-[560px] mx-auto">
              พร้อมให้คำปรึกษาและรับฟังความต้องการของคุณ
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center bg-base" aria-hidden="true">
        <div className="w-[60px] h-px bg-edge" />
      </div>

      {/* Form Section */}
      <section
        className="bg-base py-16 md:py-24 flex justify-center w-full"
        role="region"
        aria-label="ส่งข้อความ"
      >
        <div className="max-w-3xl mx-auto px-5 md:px-6">
          <div className="flex flex-col gap-8">
            <h2 className="text-lg md:text-xl font-medium text-dim uppercase tracking-wider text-center">
              ส่งข้อความ
            </h2>

            {submitStatus === "success" && (
              <div className="text-center" role="alert" aria-live="polite">
                <span className="text-sm text-green-500">
                  ส่งข้อความสำเร็จ — เราจะติดต่อกลับโดยเร็ว
                </span>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="text-center" role="alert" aria-live="polite">
                <span className="text-sm text-red-500">
                  เกิดข้อผิดพลาด — กรุณาลองใหม่อีกครั้ง
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
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

                <div className="pt-4 w-full text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-transparent border-none cursor-pointer disabled:cursor-not-allowed"
                  >
                    <div
                      className={`flex items-center gap-2 justify-center text-content font-medium text-sm transition-[gap] duration-200 ${
                        isSubmitting ? "opacity-50" : ""
                      }`}
                    >
                      <span>{isSubmitting ? "กำลังส่ง..." : "ส่งข้อความ"}</span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center bg-base" aria-hidden="true">
        <div className="w-[60px] h-px bg-edge" />
      </div>

      {/* Contact Info Section */}
      <section
        className="bg-base py-16 md:py-24 flex justify-center w-full"
        role="region"
        aria-label="ช่องทางติดต่อ"
      >
        <div className="max-w-3xl mx-auto px-5 md:px-6">
          <div className="flex flex-col gap-8">
            <h2 className="text-lg md:text-xl font-medium text-dim uppercase tracking-wider text-center">
              ช่องทางติดต่อ
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center py-2 border-b border-edge">
                <span className="text-sm text-muted">อีเมล</span>
                <Link href="mailto:visarut298@gmail.com">
                  <span className="text-sm md:text-base font-medium text-content hover:text-muted transition-colors duration-200">
                    visarut298@gmail.com
                  </span>
                </Link>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-edge">
                <span className="text-sm text-muted">โทรศัพท์</span>
                <Link href="tel:+66627283058">
                  <span className="text-sm md:text-base font-medium text-content hover:text-muted transition-colors duration-200">
                    062-728-3058
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
