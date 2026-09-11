import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { PORTFOLIO_CATEGORIES, PortfolioCategory, PortfolioItem } from "@/types/portfolio";
import { WordPressAPI } from "@/lib/wordpress";
import { generateSEO } from "@/lib/seo";
import { PhotographyLayout } from "@/components/portfolio/layouts/PhotographyLayout";
import { VideographyLayout } from "@/components/portfolio/layouts/VideographyLayout";
import { VideoEditingLayout } from "@/components/portfolio/layouts/VideoEditingLayout";
import { WebsiteLayout } from "@/components/portfolio/layouts/WebsiteLayout";
import { GraphicDesignLayout } from "@/components/portfolio/layouts/GraphicDesignLayout";
import { DefaultLayout } from "@/components/portfolio/layouts/DefaultLayout";

export function generateStaticParams() {
  return Object.keys(PORTFOLIO_CATEGORIES).map((category) => ({ category }));
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
  return generateSEO({
    title: `ผลงานหมวด${categoryName}`,
    description: `คลังผลงาน${categoryName} โดย วิศรุต แสนคำ ผู้ผลิตสื่ออิสระ`,
    url: `/portfolio/category/${category}`,
  });
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
                  <span className="bg-accent-dim text-accent font-semibold px-3 py-1 rounded-full text-sm">
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
