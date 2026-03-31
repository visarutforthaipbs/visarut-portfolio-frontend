import type { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import { JsonLd } from "@/components/JsonLd";
import ContactClient from "./ContactClient";

export const metadata: Metadata = generateSEO({
  title: "ติดต่อ / Contact",
  description:
    "ติดต่อวิศรุต แสนคำ สำหรับงานถ่ายภาพ วิดีโอ กราฟิกดีไซน์ และสื่อสร้างสรรค์ Contact Visarut Sankham for photography, videography, graphic design, and creative media.",
  url: "/contact",
});

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "ติดต่อวิศรุต แสนคำ",
  url: `${siteConfig.url}/contact`,
  description:
    "ติดต่อวิศรุต แสนคำ สำหรับงานถ่ายภาพ วิดีโอ กราฟิกดีไซน์ และสื่อสร้างสรรค์",
  mainEntity: {
    "@type": "Person",
    name: siteConfig.authorTh,
    alternateName: siteConfig.author,
    email: siteConfig.social.email,
    telephone: siteConfig.social.phone,
    url: siteConfig.url,
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactJsonLd} />
      <ContactClient />
    </>
  );
}
