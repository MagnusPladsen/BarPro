"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function AnnouncementBar() {
  const t = useTranslations("announcement");

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-[60] bg-accent text-background"
    >
      <Link
        href="/blogg"
        className="flex items-center justify-center gap-3 px-4 py-2.5 text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-accent-hover transition-colors cursor-pointer"
      >
        <span className="hidden md:inline">{t("text")}</span>
        <span className="md:hidden">{t("textShort")}</span>
        <span className="font-bold">{t("cta")} &rarr;</span>
      </Link>
    </motion.div>
  );
}
