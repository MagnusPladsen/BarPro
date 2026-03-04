"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { href: "/" as const, labelKey: "home" },
  { href: "/tjenester" as const, labelKey: "services" },
  { href: "/priser" as const, labelKey: "pricing" },
  { href: "/om-oss" as const, labelKey: "about" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as "no" | "en" });
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-background/80 border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="font-display text-xl tracking-[0.15em] uppercase text-text-primary hover:text-gold transition-colors duration-300"
            >
              BarPro
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-10 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${
                    isActive(link.href)
                      ? "text-gold"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="hidden items-center gap-8 md:flex">
              {/* Language Toggle */}
              <div className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase">
                <button
                  onClick={() => switchLocale("no")}
                  className={`transition-colors duration-300 ${
                    locale === "no"
                      ? "text-text-primary"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  NO
                </button>
                <span className="text-border w-px h-3 bg-text-muted/30" />
                <button
                  onClick={() => switchLocale("en")}
                  className={`transition-colors duration-300 ${
                    locale === "en"
                      ? "text-text-primary"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  EN
                </button>
              </div>

              {/* CTA */}
              <Link
                href="/kontakt"
                className="border border-gold/40 px-6 py-2.5 text-[11px] font-medium tracking-[0.2em] uppercase text-gold transition-all duration-300 hover:bg-gold hover:text-background"
              >
                {t("contact")}
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
              aria-label="Toggle menu"
            >
              <span
                className={`block h-px w-6 bg-text-primary transition-all duration-300 ${
                  mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-6 bg-text-primary transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-6 bg-text-primary transition-all duration-300 ${
                  mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background md:hidden"
          >
            <nav className="flex flex-col items-center gap-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-display text-4xl font-light tracking-wide transition-colors duration-300 ${
                      isActive(link.href)
                        ? "text-gold"
                        : "text-text-primary hover:text-gold"
                    }`}
                  >
                    {t(link.labelKey)}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.5 }}
              >
                <Link
                  href="/kontakt"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display text-4xl font-light tracking-wide text-gold"
                >
                  {t("contact")}
                </Link>
              </motion.div>

              {/* Language Toggle Mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 flex items-center gap-4 text-sm tracking-[0.2em] uppercase"
              >
                <button
                  onClick={() => { switchLocale("no"); setMobileMenuOpen(false); }}
                  className={`transition-colors duration-300 ${
                    locale === "no" ? "text-text-primary" : "text-text-muted"
                  }`}
                >
                  NO
                </button>
                <span className="w-px h-3 bg-text-muted/30" />
                <button
                  onClick={() => { switchLocale("en"); setMobileMenuOpen(false); }}
                  className={`transition-colors duration-300 ${
                    locale === "en" ? "text-text-primary" : "text-text-muted"
                  }`}
                >
                  EN
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
