"use client";

import { useState, useEffect } from "react";
import { X, Send, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    setTimeout(() => {
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus("idle");
        onClose();
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-base border border-edge rounded-3xl shadow-2xl overflow-hidden z-10 my-auto p-6 md:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-edge/60">
          <div>
            <h3 className="text-lg font-bold text-content leading-tight">ติดต่องาน &amp; สอบถาม</h3>
            <span className="text-xs text-muted">วิศรุต แสนคำ • Visual Storyteller &amp; Producer</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-dim hover:text-content hover:bg-surface rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {submitStatus === "success" ? (
          <div className="py-8 text-center flex flex-col items-center gap-3">
            <div className="p-3 bg-green-500/10 text-green-500 rounded-full">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-base font-bold text-content">ส่งข้อความสำเร็จ!</h4>
            <p className="text-xs text-muted max-w-xs">
              ขอบคุณที่สนใจร่วมงาน เราจะติดต่อกลับทางอีเมลของคุณโดยเร็วที่สุด
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-dim block mb-1 font-medium">ชื่อของคุณ</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ชื่อ-นามสกุล"
                  className="w-full px-3.5 py-2.5 bg-surface border border-edge rounded-xl text-xs text-content focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs text-dim block mb-1 font-medium">อีเมล</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="yourname@domain.com"
                  className="w-full px-3.5 py-2.5 bg-surface border border-edge rounded-xl text-xs text-content focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-dim block mb-1 font-medium">หัวข้อ</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="เช่น ถ่ายภาพ / พัฒนาเว็บ / ผลิตวิดีโอ"
                className="w-full px-3.5 py-2.5 bg-surface border border-edge rounded-xl text-xs text-content focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs text-dim block mb-1 font-medium">รายละเอียดข้อความ</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="ข้อความหรือรายละเอียดโครงการที่ต้องการหารือ..."
                className="w-full px-3.5 py-2.5 bg-surface border border-edge rounded-xl text-xs text-content focus:outline-none focus:border-accent resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-content text-base font-semibold rounded-xl text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 mt-1"
            >
              <Send size={14} />
              <span>{isSubmitting ? "กำลังส่งข้อความ..." : "ส่งข้อความทันที"}</span>
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-edge/60 flex items-center justify-between text-xs text-dim">
          <span className="flex items-center gap-1">
            <Mail size={12} /> visarut298@gmail.com
          </span>
          <span className="flex items-center gap-1">
            <Phone size={12} /> 062-728-3058
          </span>
        </div>
      </div>
    </div>
  );
}
