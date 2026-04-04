"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <a
        href="#main-content"
        className="absolute -top-[100px] left-1/2 -translate-x-1/2 bg-surface text-content px-4 py-2 rounded-md text-sm font-medium z-[1000] transition-[top] duration-200 no-underline focus:top-3"
      >
        ข้ามไปยังเนื้อหาหลัก
      </a>
      <Header />
      <main className="flex-1" id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
