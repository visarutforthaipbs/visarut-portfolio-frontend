import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "เกี่ยวกับ",
  description: "ประวัติและประสบการณ์การทำงานของ วิศรุต แสนคำ ผู้ผลิตสื่อ ช่างภาพ และนักพัฒนาเว็บไซต์",
  url: "/about",
});

export default function AboutPage() {
  return <AboutClient />;
}
