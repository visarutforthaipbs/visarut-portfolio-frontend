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
      className="sticky top-0 z-[999] flex justify-center w-full border-b border-edge bg-base/90 backdrop-blur-md"
    >
      <div className="max-w-6xl w-full mx-auto px-5 md:px-6">
        <div className="flex items-center justify-between h-[52px] md:h-[56px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
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
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href} aria-current={isActive ? "page" : undefined}>
                  <span
                    className={`text-xs md:text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-150 ${
                      isActive ? "text-content bg-surface" : "text-dim hover:text-content hover:bg-surface/50"
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
            className="flex flex-col items-start gap-1 pb-4 md:hidden border-t border-edge/40 pt-2"
          >
            {navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  <span
                    className={`block w-full text-sm py-2 px-3 rounded-lg ${
                      isActive ? "text-content bg-surface font-semibold" : "text-dim"
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
