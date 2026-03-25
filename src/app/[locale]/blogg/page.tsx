"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { BookingCallout } from "@/components/sections/BookingCallout";
import { ColorOrbs } from "@/components/ui/ColorOrbs";

const ease = [0.16, 1, 0.3, 1] as const;

export default function BloggPage() {
  const t = useTranslations("blogPage");

  return (
    <>
      {/* Hero */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        <ColorOrbs size="small" intensity={0.5} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="text-[11px] tracking-[0.25em] uppercase text-accent mb-6"
          >
            {t("hero.label")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display italic font-light text-4xl md:text-5xl lg:text-6xl text-text-primary leading-[1.1]"
          >
            {t("hero.heading")}
          </motion.h1>
        </div>
      </section>

      {/* Posts — no boxes, clean editorial style */}
      <section className="pb-40 px-6 space-y-24">
        {/* Booking post */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-px bg-accent" />
            <span className="text-[11px] tracking-[0.25em] uppercase text-text-muted">
              {t("posts.booking.date")}
            </span>
          </div>
          <h2 className="font-display italic font-light text-3xl md:text-4xl text-text-primary mb-8 leading-[1.15]">
            {t("posts.booking.title")}
          </h2>
          <div className="space-y-6 text-text-muted text-lg leading-relaxed">
            <p>{t("posts.booking.p1")}</p>
            <p>{t("posts.booking.p2")}</p>
            <p>{t("posts.booking.p3")}</p>
            <p>{t("posts.booking.p4")}</p>
            <p>{t("posts.booking.p5")}</p>
          </div>
          <div className="w-12 h-px bg-accent mt-12 mb-6" />
          <p className="text-text-muted/60 italic text-sm">{t("posts.booking.signoff")}</p>
        </motion.article>

        {/* Divider */}
        <div className="max-w-3xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        </div>

        {/* Welcome post */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-px bg-accent" />
            <span className="text-[11px] tracking-[0.25em] uppercase text-text-muted">
              {t("posts.welcome.date")}
            </span>
          </div>
          <h2 className="font-display italic font-light text-3xl md:text-4xl text-text-primary mb-8 leading-[1.15]">
            {t("posts.welcome.title")}
          </h2>
          <div className="space-y-6 text-text-muted text-lg leading-relaxed">
            <p>{t("posts.welcome.p1")}</p>
            <p>{t("posts.welcome.p2")}</p>
            <p>{t("posts.welcome.p3")}</p>
            <p>{t("posts.welcome.p4")}</p>
            <p>{t("posts.welcome.p5")}</p>
          </div>
          <div className="w-12 h-px bg-accent mt-12 mb-6" />
          <p className="text-text-muted/60 italic text-sm">{t("posts.welcome.signoff")}</p>
        </motion.article>
      </section>

      <BookingCallout />
    </>
  );
}
