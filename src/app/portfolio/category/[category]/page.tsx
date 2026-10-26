import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { PORTFOLIO_CATEGORIES, PortfolioCategory, PortfolioItem } from "@/types/portfolio";
import { WordPressAPI } from "@/lib/wordpress";
import { generateSEO } from "@/lib/seo";
import { getCategoryCounts } from "@/lib/categoryCounts";
import { PhotographyLayout } from "@/components/portfolio/layouts/PhotographyLayout";
import { VideographyLayout } from "@/components/portfolio/layouts/VideographyLayout";
import { VideoEditingLayout } from "@/components/portfolio/layouts/VideoEditingLayout";
import { WebsiteLayout } from "@/components/portfolio/layouts/WebsiteLayout";
import { GraphicDesignLayout } from "@/components/portfolio/layouts/GraphicDesignLayout";
import { DefaultLayout } from "@/components/portfolio/layouts/DefaultLayout";

export function generateStaticParams() {
  return Object.keys(PORTFOLIO_CATEGORIES).map((category) => ({ category }));
}

const CATEGORY_DESCRIPTIONS: Partial<Record<PortfolioCategory, string>> = {
  photography:
    "ผลงานภาพถ่ายสารคดีและภาพข่าวของวิศรุต แสนคำ ช่างภาพอิสระเชียงใหม่ ให้ประชาธรรม เบนาร์นิวส์ กรีนพีซ และ IOM ในประเด็นชุมชน แรงงาน และสิ่งแวดล้อม",
  website:
    "ผลงานพัฒนาเว็บไซต์และระบบจัดการเนื้อหาให้องค์กรภาคประชาสังคม เช่น สมัชชาคนจน สมาคมแม่น้ำเพื่อชีวิต มูลนิธิศูนย์ข้อมูลชุมชน และ Yangnar Studio โดยวิศรุต แสนคำ",
  videography:
    "ผลงานถ่ายวิดีโอสารคดีและแคมเปญประเด็นสังคม ให้ Plan International ประชาธรรม ประชาไท และมูลนิธิเอ็มเพาเวอร์ เรื่องแรงงานข้ามชาติ ผู้ลี้ภัย และสิ่งแวดล้อม",
  "video-editing":
    "ผลงานตัดต่อวิดีโอสารคดีและพอดแคสต์ เช่น Migrant Mother, Breath Talk และอีสานแล้งในยุคโลกรวน ให้ประชาธรรม ประชาไท และ Plan International โดยวิศรุต แสนคำ",
  producer:
    "ผลงานโปรดิวเซอร์ของวิศรุต แสนคำ ดูแลการผลิตสื่อตั้งแต่ไอเดียถึงชิ้นงาน ทั้งวิดีโอองค์กร แคมเปญ #ส้นสูงส่งเสียง แผนที่ข้อมูลชุมชน และกราฟิกนิทรรศการ",
  writing:
    "งานเขียนสารคดีและข่าวของวิศรุต แสนคำ เผยแพร่กับประชาธรรม เช่น จากมาดริดถึงกรุงเทพ วิถีคนทำเพจ MMO ชาวกัมพูชา และน้ำผุดกลางหมู่บ้านรินหลวง เชียงดาว",
  "graphic-design":
    "ผลงานออกแบบกราฟิกเพื่อการรณรงค์ เช่น โปสเตอร์ให้แอมเนสตี้ แผนที่ทุ่งรับน้ำให้ HaRDstories และกราฟิกการศึกษาเพื่อทุกคน โดยวิศรุต แสนคำ ผู้ผลิตสื่ออิสระ",
  exhibition:
    "ผลงานนิทรรศการและการสื่อสารแคมเปญ เช่น Livable Chiangmai กับสภาลมหายใจเชียงใหม่ และยังฮ่วมใจ๊ : นวัตกรรมวัยยัง กับมูลนิธิโกมลคีมทอง โดยวิศรุต แสนคำ",
  print:
    "ผลงานสิ่งพิมพ์ของวิศรุต แสนคำ ผู้ผลิตสื่ออิสระ เชียงใหม่ เช่น คู่มือนักข่าวพลเมืองเพื่อติดตามโครงการพัฒนา ที่จัดทำร่วมกับประชาธรรม",
  game:
    "เกมที่พัฒนาโดยวิศรุต แสนคำ: Under Two Skies เกมวางแผนเอาตัวรอดว่าด้วยไร่หมุนเวียนและไฟของหมู่บ้านบนดอย ภายใต้การตรวจจับจุดความร้อนจากดาวเทียม",
  app:
    "แอปพลิเคชันที่พัฒนาโดยวิศรุต แสนคำ: บิลง่าย (BillNgai) แอปออกใบเสนอราคา ใบแจ้งหนี้ และใบเสร็จสำหรับฟรีแลนซ์ไทย ข้อมูลอยู่ในเครื่อง ใช้ได้บน Mac และ Windows",
  "live-stream":
    "ผลงานไลฟ์สดของวิศรุต แสนคำ ผู้ผลิตสื่ออิสระ เชียงใหม่ เช่น เชียงใหม่ : การย้ายถิ่นและการอยู่ร่วมกัน ถ่ายทอดสดให้ Burma Concern",
};

function categoryDescription(category: PortfolioCategory, name: string): string {
  return (
    CATEGORY_DESCRIPTIONS[category] ??
    `หมวด${name}ในคลังผลงานของวิศรุต แสนคำ ผู้ผลิตสื่ออิสระ เชียงใหม่ ทั้งภาพถ่าย วิดีโอ เว็บไซต์ และงานเขียนเพื่อประเด็นสังคม`
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  if (!category || !(category in PORTFOLIO_CATEGORIES)) {
    return { title: "ไม่พบหมวดหมู่" };
  }

  const categoryName = PORTFOLIO_CATEGORIES[category as PortfolioCategory];
  const meta = generateSEO({
    title: `ผลงานหมวด${categoryName}`,
    description: categoryDescription(category as PortfolioCategory, categoryName),
    url: `/portfolio/category/${category}`,
  });
  // UX-012: an empty category is a thin page — keep it out of the index until it has work.
  const counts = await getCategoryCounts();
  if (counts && (counts[category] ?? 0) === 0) {
    return { ...meta, robots: { index: false, follow: true } };
  }
  return meta;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  // Validate category
  if (!category || !(category in PORTFOLIO_CATEGORIES)) {
    notFound();
  }

  const typedCategory = category as PortfolioCategory;
  const categoryName = PORTFOLIO_CATEGORIES[typedCategory];

  let portfolios: PortfolioItem[] = [];
  try {
    const response = await WordPressAPI.getPortfolios({
      categories: typedCategory,
      per_page: 20,
    });
    portfolios = response.items;
  } catch (err) {
    console.error("Error loading category portfolios:", err);
  }

  // Render category-specific layout
  const renderCategoryLayout = () => {
    const props = { portfolios, loading: false };

    switch (typedCategory) {
      case "photography":
        return <PhotographyLayout {...props} />;
      case "videography":
        return <VideographyLayout {...props} />;
      case "video-editing":
        return <VideoEditingLayout {...props} />;
      case "website":
        return <WebsiteLayout {...props} />;
      case "graphic-design":
        return <GraphicDesignLayout {...props} />;
      case "print":
      case "exhibition":
      case "campaign":
      case "producer":
      default:
        return <DefaultLayout {...props} category={typedCategory} />;
    }
  };

  return (
    <Layout>
      <div className="flex justify-center w-full">
        <div className="max-w-5xl w-full py-16 md:py-20 px-5 md:px-6">
          <div className="flex flex-col gap-8 items-start w-full">
            {/* Navigation */}
            <nav aria-label="เส้นทางนำทาง" className="flex items-center gap-2 text-sm text-dim">
              <Link href="/" className="hover:text-accent transition-colors">
                หน้าหลัก
              </Link>
              <span>/</span>
              <Link href="/portfolio" className="hover:text-accent transition-colors">
                ผลงาน
              </Link>
              <span>/</span>
              <span className="text-content font-medium">{categoryName}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="flex items-center gap-4">
                <Link href="/portfolio" className="group">
                  <span className="flex items-center gap-2 text-dim group-hover:text-accent transition-colors">
                    <ArrowLeft size={20} />
                    <span>กลับไปดูผลงานทั้งหมด</span>
                  </span>
                </Link>
              </div>

              <div className="flex flex-col gap-2 items-start">
                <h1 className="text-2xl md:text-4xl text-content font-bold">
                  {categoryName}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="bg-brand-dim text-accent font-semibold px-3 py-1 rounded-full text-sm">
                    {portfolios.length} ผลงาน
                  </span>
                </div>
              </div>
            </div>

            {/* Category-specific layout */}
            {renderCategoryLayout()}
          </div>
        </div>
      </div>
    </Layout>
  );
}
