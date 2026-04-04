"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="mt-auto flex justify-center w-full border-t border-edge bg-base"
    >
      <div className="max-w-5xl w-full mx-auto px-5 md:px-6">
        <div className="flex justify-between items-center py-6 flex-wrap gap-3">
          <span className="text-xs text-dim">
            © {new Date().getFullYear()} {siteConfig.authorTh}
          </span>

          <div className="flex items-center gap-4">
            <Link href={`mailto:${siteConfig.social.email}`}>
              <span className="text-xs text-dim hover:text-content transition-colors duration-150">
                Email
              </span>
            </Link>
            {siteConfig.social.instagram && (
              <Link href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">
                <span className="text-xs text-dim hover:text-content transition-colors duration-150">
                  Instagram
                </span>
              </Link>
            )}
            {siteConfig.social.facebook && (
              <Link href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer">
                <span className="text-xs text-dim hover:text-content transition-colors duration-150">
                  Facebook
                </span>
              </Link>
            )}
            {siteConfig.social.linkedin && (
              <Link href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer">
                <span className="text-xs text-dim hover:text-content transition-colors duration-150">
                  LinkedIn
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
