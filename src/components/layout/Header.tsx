"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation } from "@/lib/config";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      role="banner"
      className="sticky top-0 z-[999] flex justify-center w-full border-b border-edge bg-base backdrop-blur-[12px]"
    >
      <div className="max-w-5xl w-full mx-auto px-5 md:px-6">
        <div className="flex items-center justify-between h-[52px] md:h-[56px]">
          {/* Logo */}
          <Link href="/">
            <img
              src="/logo/logo-1.svg"
              alt="วิศรุต แสนคำ"
              className="h-6 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav
            aria-label="เมนูหลัก"
            className="hidden md:flex items-center gap-1"
          >
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                item.subItems?.some((sub) => pathname === sub.href);
              return (
                <Link key={item.href} href={item.href} aria-current={isActive ? "page" : undefined}>
                  <span
                    className={`text-sm px-3 py-1 transition-colors duration-150 ${
                      isActive ? "text-content" : "text-dim hover:text-content"
                    }`}
                  >
                    {item.labelTh || item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            className="block md:hidden text-muted cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav
            aria-label="เมนูมือถือ"
            id="mobile-nav"
            className="flex flex-col items-start gap-0 pb-4 md:hidden"
          >
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                item.subItems?.some((sub) => pathname === sub.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  <span
                    className={`text-sm py-2 ${
                      isActive ? "text-content" : "text-dim"
                    }`}
                  >
                    {item.labelTh || item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
