import type { Metadata } from "next";
import V2Client from "./V2Client";

export const metadata: Metadata = {
  title: "Visarut Sankham – Public Intelligence & Civic Technology",
  description:
    "Specialist in public intelligence systems, civic technology, and NLP-driven data analysis for transparency and institutional impact.",
  robots: { index: false, follow: false },
};

export default function V2Page() {
  return <V2Client />;
}
