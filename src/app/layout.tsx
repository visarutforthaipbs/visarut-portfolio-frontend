import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { WebVitals } from "@/components/WebVitals";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1117" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
};

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
    "Chiang Mai",
    "เชียงใหม่",
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
        url: "/image/social-thumbnail.jpg",
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
    images: ["/image/social-thumbnail.jpg"],
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
        url: "/logo/logo-1.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/logo/logo-1.svg",
    apple: [
      {
        url: "/logo/logo-1.svg",
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
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="วิศรุต แสนคำ" />
        <meta name="application-name" content="วิศรุต แสนคำ" />
        <meta name="msapplication-TileColor" content="#1D1D1F" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* System font stack (SF Pro on Apple devices) — no webfont to preload */}

        {/* DNS prefetch for external domains */}
        <link rel="preconnect" href="https://api.sankham.cv" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//api.sankham.cv" />

        {/* Google tag (gtag.js) — rendered server-side in <head> so Search
            Console can verify ownership via the Google Analytics method. */}
        {GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
              id="google-analytics"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body suppressHydrationWarning>
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
