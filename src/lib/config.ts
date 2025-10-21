import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  title: "Visarut Sankham - Media Professional",
  titleTh: "วิศรุต แสนคำ - ผู้ผลิตสื่อ",
  description:
    "Thai media professional specializing in photography, videography, web development, graphic design, and creative services.",
  descriptionTh:
    "ผู้ผลิตสื่อหลายรูปแบบ โดยมีความเชี่ยวชาญเป็นพิเศษกับภาคประชาสังคม องค์กรพัฒนาเอกชน และสถาบันการศึกษา",
  author: "Visarut Sankham",
  authorTh: "วิศรุต แสนคำ",
  url: "https://visarutsankham.com",
  social: {
    facebook: "https://www.facebook.com/visarut.sankham/",
    instagram: "https://www.instagram.com/visarut_sankham/",
    youtube: "https://www.youtube.com/@thaimigrantwatchs",
    linkedin: "https://www.linkedin.com/in/visarut-sankham-99b008b9/",
    email: "visarut298@gmail.com",
    phone: "+66-627-283-058",
  },
  api: {
    wordpress: {
      baseUrl: "https://backend.visarutsankham.com/wp-json/wp/v2",
      postsEndpoint: "/portfolios",
      categoriesEndpoint: "/portfolio_category",
      blogPostsEndpoint: "/posts",
      blogCategoriesEndpoint: "/categories",
    },
  },
};

export const navigation = [
  {
    label: "Home",
    labelTh: "หน้าแรก",
    href: "/",
  },
  {
    label: "Portfolio",
    labelTh: "ผลงาน",
    href: "/portfolio",
  },
  {
    label: "Personal Projects",
    labelTh: "โครงการส่วนตัว",
    href: "/personal-projects",
    subItems: [
      {
        label: "#PHOTOFORAIR",
        labelTh: "#PHOTOFORAIR",
        href: "/personal-projects",
      },
    ],
  },
  {
    label: "Blog",
    labelTh: "บล็อก",
    href: "/blog",
  },
  {
    label: "About",
    labelTh: "เกี่ยวกับ",
    href: "/about",
  },
];

export const themeConfig = {
  colors: {
    primary: "#1a1a1a",
    secondary: "#ffffff",
    accent: "#6b7280", // Apple-style gray-blue
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
  },
  fonts: {
    heading:
      '"DB Helvethaica", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    body: '"DB Helvethaica", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    thai: '"DB Helvethaica", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  breakpoints: {
    sm: "30em", // 480px
    md: "48em", // 768px
    lg: "62em", // 992px
    xl: "80em", // 1280px
    "2xl": "96em", // 1536px
  },
};
