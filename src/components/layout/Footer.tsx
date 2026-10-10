import Link from "next/link";
import { siteConfig } from "@/lib/config";

const linkClass =
  "inline-flex items-center min-h-[32px] px-1.5 -mx-1.5 rounded-md text-sm text-dim hover:text-content transition-colors duration-150";

export function Footer() {
  const links = [
    { href: `mailto:${siteConfig.social.email}`, label: "อีเมล", external: false },
    { href: siteConfig.social.instagram, label: "Instagram", external: true },
    { href: siteConfig.social.facebook, label: "Facebook", external: true },
    { href: siteConfig.social.linkedin, label: "LinkedIn", external: true },
  ].filter((l): l is { href: string; label: string; external: boolean } => Boolean(l.href));

  return (
    <footer
      role="contentinfo"
      className="mt-auto flex justify-center w-full border-t border-edge bg-canvas"
    >
      <div className="max-w-5xl w-full mx-auto px-5 md:px-6">
        <div className="flex justify-between items-center py-6 flex-wrap gap-3">
          <span className="text-sm text-dim">
            © {new Date().getFullYear()} {siteConfig.authorTh}
          </span>

          <nav aria-label="ช่องทางติดต่อ" className="flex items-center gap-5">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={linkClass}
                {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
