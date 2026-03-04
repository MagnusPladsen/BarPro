import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const pageLinks = [
  { href: "/" as const, labelKey: "home" },
  { href: "/tjenester" as const, labelKey: "services" },
  { href: "/om-oss" as const, labelKey: "about" },
  { href: "/kontakt" as const, labelKey: "contact" },
] as const;

export async function Footer() {
  const tFooter = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          {/* Column 1: Logo & Tagline */}
          <div>
            <Link
              href="/"
              className="font-display text-lg tracking-[0.15em] uppercase text-text-primary hover:text-gold transition-colors duration-300"
            >
              BarPro
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-text-muted">
              {tFooter("tagline")}
            </p>
          </div>

          {/* Column 2: Pages */}
          <div>
            <h3 className="mb-6 text-[11px] font-medium uppercase tracking-[0.25em] text-text-muted">
              {tFooter("pages")}
            </h3>
            <ul className="space-y-4">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors duration-300 hover:text-text-primary"
                  >
                    {tNav(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="mb-6 text-[11px] font-medium uppercase tracking-[0.25em] text-text-muted">
              {tFooter("contactHeading")}
            </h3>
            <ul className="space-y-4 text-sm text-text-muted">
              <li>
                <a
                  href="mailto:Barproda@gmail.com"
                  className="transition-colors duration-300 hover:text-text-primary"
                >
                  Barproda@gmail.com
                </a>
              </li>
              <li>
                <span className="text-text-muted/60">Emil — </span>
                <a
                  href="tel:+4790225293"
                  className="transition-colors duration-300 hover:text-text-primary"
                >
                  902 25 293
                </a>
              </li>
              <li>
                <span className="text-text-muted/60">Sofie — </span>
                <a
                  href="tel:+4747604766"
                  className="transition-colors duration-300 hover:text-text-primary"
                >
                  476 04 766
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 border-t border-border pt-8 text-center text-[11px] tracking-[0.15em] uppercase text-text-muted/50">
          &copy; 2026 BarPro. {tFooter("rights")}
        </div>
      </div>
    </footer>
  );
}
