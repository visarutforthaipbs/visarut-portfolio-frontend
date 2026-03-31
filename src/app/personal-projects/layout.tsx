import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "#PHOTOFORAIR - เปลี่ยนภาพเพื่อออกาศที่เท่ากัน | Visarut Sankham",
  description:
    "แคมเปญสังคม #PHOTOFORAIR เปลี่ยนภาพถ่ายด้วย Preset CNXPM2.5 เพื่อระดมทุนซื้อหน้ากาก N95 แจกจ่ายให้แรงงานข้ามชาติในเชียงใหม่ ช่วยลดความเหลื่อมล้ำในการเข้าถึงอากาศบริสุทธิ์ระหว่างวิกฤตฝุ่นควัน PM2.5",
  keywords: [
    "PHOTOFORAIR",
    "CNXPM2.5",
    "ฝุ่นควัน PM2.5",
    "เชียงใหม่",
    "แคมเปญสังคม",
    "Lightroom Preset",
    "แรงงานข้ามชาติ",
    "หน้ากาก N95",
    "มลพิษทางอากาศ",
    "Social Campaign",
    "Photography for Air Quality",
    "Chiang Mai",
    "Air Pollution",
    "Migrant Workers",
  ],
  authors: [{ name: "Visarut Sankham", url: siteConfig.url }],
  creator: "Visarut Sankham",
  openGraph: {
    title: "#PHOTOFORAIR - เปลี่ยนภาพเพื่ออากาศที่เท่ากัน",
    description:
      "แคมเปญสังคมที่ใช้ Photography Preset เพื่อระดมทุนช่วยเหลือแรงงานข้ามชาติในเชียงใหม่ให้เข้าถึงหน้ากาก N95 ระหว่างวิกฤตฝุ่นควัน PM2.5 ดำเนินการตั้งแต่ปี 2564",
    url: `${siteConfig.url}/personal-projects`,
    siteName: "Visarut Sankham Portfolio",
    locale: "th_TH",
    type: "website",
    images: [
      {
        url: "/image/pfa/facebook-thumnail.jpg",
        width: 1200,
        height: 628,
        alt: "#PHOTOFORAIR - เปรียบเทียบภาพก่อนและหลัง Preset CNXPM2.5 ที่ดอยสุเทพ เชียงใหม่",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "#PHOTOFORAIR - เปลี่ยนภาพเพื่ออากาศที่เท่ากัน",
    description:
      "แคมเปญสังคมที่ใช้ Photography Preset ระดมทุนช่วยแรงงานข้ามชาติในเชียงใหม่ให้เข้าถึงหน้ากาก N95",
    images: ["/image/pfa/facebook-thumnail.jpg"],
    creator: "@visarutsankham",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: `${siteConfig.url}/personal-projects`,
  },
};

export default function PersonalProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
