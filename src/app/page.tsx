import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { JsonLd } from "@/components/JsonLd";
import {
  generatePersonSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/seo";

export const metadata: Metadata = {
  // Use default metadata from layout or override if needed
};

export default function HomePage() {
  return (
    <>
      {/* Structured Data injected on the server */}
      <JsonLd data={generatePersonSchema()} />
      <JsonLd data={generateOrganizationSchema()} />
      <JsonLd data={generateWebsiteSchema()} />
      
      <HomeClient />
    </>
  );
}
