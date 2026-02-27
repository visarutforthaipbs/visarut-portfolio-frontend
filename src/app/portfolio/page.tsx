import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";
import { generateSEO } from "@/lib/seo";
import { WordPressAPI } from "@/lib/wordpress";

export const metadata: Metadata = generateSEO({
  title: "ผลงาน",
  description: "รวมผลงานที่ผ่านมา แสดงความเชี่ยวชาญในการถ่ายภาพ วิดีโอ การพัฒนาเว็บไซต์ และการออกแบบ โดย วิศรุต แสนคำ",
  url: "/portfolio",
});

async function getInitialPortfolios() {
  try {
    const response = await WordPressAPI.getPortfolios({
      per_page: 9,
      page: 1,
    });
    return response;
  } catch (error) {
    console.error("Error fetching initial portfolios:", error);
    return { items: [], total: 0, totalPages: 0 };
  }
}

export default async function PortfolioPage() {
  const { items, total, totalPages } = await getInitialPortfolios();

  return (
    <PortfolioClient 
      initialPortfolios={items} 
      initialTotal={total} 
      initialTotalPages={totalPages} 
    />
  );
}
