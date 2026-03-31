import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { WebVitals } from "@/components/WebVitals";
import { siteConfig } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: [
    "portfolio",
    "photography",
    "videography",
    "web development",
    "graphic design",
    "Thai creative professional",
    "วิศรุต แสนคำ",
    "ถ่ายภาพ",
    "ถ่ายวิดีโอ",
    "พัฒนาเว็บไซต์",
    "กราฟิกดีไซน์",
    "สื่อ",
    "ผู้ผลิตสื่อ",
    "creative services",
    "Thailand",
    "Bangkok",
  ],
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    alternateLocale: ["en_US"],
    url: siteConfig.url,
    title: siteConfig.titleTh,
    description: siteConfig.descriptionTh,
    siteName: siteConfig.titleTh,
    images: [
      {
        url: "/image/profile.png",
        width: 1200,
        height: 630,
        alt: siteConfig.titleTh,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.titleTh,
    description: siteConfig.descriptionTh,
    creator: "@visarutsankham",
    images: ["/image/profile.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/logo/white-favicon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/logo/white-favicon.svg",
    apple: [
      {
        url: "/logo/white-favicon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  },
  manifest: `/site.webmanifest`,
  verification: {
    // Set these in environment variables when ready:
    // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, etc.
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#6b7280" />
        <meta name="color-scheme" content="light dark" />
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="วิศรุต แสนคำ" />
        <meta name="application-name" content="วิศรุต แสนคำ" />
        <meta name="msapplication-TileColor" content="#6b7280" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/font/dbhelvethaicax-webfont.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/font/dbhelvethaicaxmed-webfont.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/font/dbhelvethaicaxbd-webfont.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//visarutsankham.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Canonical URL will be set per page */}
        <link rel="canonical" href={siteConfig.url} />
      </head>
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="skip-to-content"
        >
          ข้ามไปที่เนื้อหาหลัก (Skip to main content)
        </a>
        <Providers>
          <WebVitals />
          {children}
        </Providers>
      </body>
    </html>
  );
}
