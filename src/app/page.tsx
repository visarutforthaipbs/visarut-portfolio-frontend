import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { JsonLd } from "@/components/JsonLd";
import { generatePersonSchema, generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";
import { WordPressAPI } from "@/lib/wordpress";
import type { PortfolioItem } from "@/types/portfolio";

export const metadata: Metadata = {};
export const revalidate = 300;

export default async function HomePage() {
  let portfolios: PortfolioItem[] = [];
  try {
    portfolios = (await WordPressAPI.getAllPortfolios()).items;
  } catch {
    // The client can retry while the rest of the homepage remains available.
  }
  return (
    <>
      <JsonLd data={generatePersonSchema()} />
      <JsonLd data={generateOrganizationSchema()} />
      <JsonLd data={generateWebsiteSchema()} />
      <HomeClient featuredPortfolios={portfolios} />
    </>
  );
}
