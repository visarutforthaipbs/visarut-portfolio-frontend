import { Metadata } from "next";

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
  authors: [{ name: "Visarut Sankham", url: "https://visarut.com" }],
  creator: "Visarut Sankham",
  openGraph: {
    title: "#PHOTOFORAIR - เปลี่ยนภาพเพื่ออากาศที่เท่ากัน",
    description:
      "แคมเปญสังคมที่ใช้ Photography Preset เพื่อระดมทุนช่วยเหลือแรงงานข้ามชาติในเชียงใหม่ให้เข้าถึงหน้ากาก N95 ระหว่างวิกฤตฝุ่นควัน PM2.5 ดำเนินการตั้งแต่ปี 2564",
    url: "https://visarut.com/personal-projects",
    siteName: "Visarut Sankham Portfolio",
    locale: "th_TH",
    type: "website",
    images: [
      {
        url: "/image/pfa/x2-1-2.jpg",
        width: 1200,
        height: 630,
        alt: "#PHOTOFORAIR Campaign - เชียงใหม่ท่ามกลางฝุ่นควัน",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "#PHOTOFORAIR - เปลี่ยนภาพเพื่ออากาศที่เท่ากัน",
    description:
      "แคมเปญสังคมที่ใช้ Photography Preset ระดมทุนช่วยแรงงานข้ามชาติในเชียงใหม่ให้เข้าถึงหน้ากาก N95",
    images: ["/image/pfa/x2-1-2.jpg"],
    creator: "@visarut",
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
    canonical: "https://visarut.com/personal-projects",
  },
};

export default function PersonalProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
