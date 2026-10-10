import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

export function generateSEO({
  title,
  description,
  image = "/image/social-thumbnail.jpg",
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: SEOProps): Metadata {
  const metaTitle = title
    ? `${title} | ${siteConfig.titleTh}`
    : siteConfig.titleTh;
  const metaDescription = description || siteConfig.descriptionTh;
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const metaImage = image.startsWith("http")
    ? image
    : `${siteConfig.url}${image}`;

  const metadata: Metadata = {
    title: title || siteConfig.titleTh,
    description: metaDescription,
    alternates: {
      canonical: metaUrl,
    },
    openGraph: {
      type,
      locale: "th_TH",
      alternateLocale: ["en_US"],
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.titleTh,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      creator: "@visarutsankham",
      images: [metaImage],
    },
  };

  // Add article-specific metadata
  if (
    type === "article" &&
    (publishedTime || modifiedTime || authors || tags)
  ) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: authors?.map((author) => `${siteConfig.url}/about/${author}`),
      tags,
    };
  }

  return metadata;
}

// Structured Data helpers
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.authorTh,
    alternateName: siteConfig.author,
    url: siteConfig.url,
    image: `${siteConfig.url}/image/social-thumbnail.jpg`,
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
      siteConfig.social.youtube,
    ],
    jobTitle: "ผู้ผลิตสื่อ",
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
    knowsAbout: [
      "Photography",
      "Videography",
      "Web Development",
      "Graphic Design",
      "Media Production",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangkok",
      addressCountry: "Thailand",
    },
    email: siteConfig.social.email,
    telephone: siteConfig.social.phone,
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.titleTh,
    alternateName: siteConfig.title,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo/logo-1.svg`,
    image: `${siteConfig.url}/image/social-thumbnail.jpg`,
    description: siteConfig.descriptionTh,
    founder: { "@id": `${siteConfig.url}/#person` },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.social.phone,
      email: siteConfig.social.email,
      contactType: "customer service",
      availableLanguage: ["Thai", "English"],
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
      siteConfig.social.youtube,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangkok",
      addressCountry: "Thailand",
    },
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.titleTh,
    alternateName: siteConfig.title,
    url: siteConfig.url,
    description: siteConfig.descriptionTh,
    inLanguage: "th-TH",
    publisher: { "@id": `${siteConfig.url}/#person` },
  };
}

export function generateCreativeWorkSchema(work: {
  title: string;
  description: string;
  image: string;
  dateCreated: string;
  category: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${work.url}#creativework`,
    name: work.title,
    description: work.description,
    image: work.image,
    dateCreated: work.dateCreated,
    creator: { "@id": `${siteConfig.url}/#person`, "@type": "Person", name: siteConfig.authorTh },
    author: { "@id": `${siteConfig.url}/#person` },
    genre: work.category,
    url: work.url,
    mainEntityOfPage: work.url,
    inLanguage: "th-TH",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
  };
}
