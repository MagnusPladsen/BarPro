"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { BookingCallout } from "@/components/sections/BookingCallout";

const ease = [0.16, 1, 0.3, 1] as const;

export default function BloggPage() {
  const t = useTranslations("blogPage");

  return (
    <>
      {/* Hero */}
      <section className="pt-48 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="text-[11px] tracking-[0.25em] uppercase text-gold mb-6"
          >
            {t("hero.label")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-text-primary leading-[1.1]"
          >
            {t("hero.heading")}
          </motion.h1>
        </div>
      </section>

      {/* First Post */}
      <section className="pb-40 px-6">
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease }}
          className="max-w-3xl mx-auto"
        >
          <div className="border border-border bg-background-card p-10 md:p-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-px bg-gold" />
              <span className="text-[11px] tracking-[0.25em] uppercase text-text-muted">
                {t("posts.welcome.date")}
              </span>
            </div>

            <h2 className="font-display font-light text-3xl md:text-4xl text-text-primary mb-8 leading-[1.15]">
              {t("posts.welcome.title")}
            </h2>

            <div className="space-y-6 text-text-muted text-lg leading-relaxed">
              <p>{t("posts.welcome.p1")}</p>
              <p>{t("posts.welcome.p2")}</p>
              <p>{t("posts.welcome.p3")}</p>
              <p>{t("posts.welcome.p4")}</p>
              <p>{t("posts.welcome.p5")}</p>
            </div>

            <div className="w-12 h-px bg-gold mt-12 mb-10" />

            <p className="text-text-muted italic">
              {t("posts.welcome.signoff")}
            </p>
          </div>

          <div className="text-center mt-16">
            <Button href="/kontakt" variant="outline">
              {t("cta")} &rarr;
            </Button>
          </div>
        </motion.article>
      </section>

      <BookingCallout />
    </>
  );
}
