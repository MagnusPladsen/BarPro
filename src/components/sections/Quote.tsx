"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export function Quote() {
  const t = useTranslations("quote");

  return (
    <section className="py-40 px-6 bg-background-card/30">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease }}
        >
          <div className="w-16 h-px bg-gold mx-auto mb-16" />
          <blockquote className="font-display font-light text-2xl md:text-3xl lg:text-4xl text-text-primary leading-relaxed italic mb-10">
            &ldquo;{t("text")}&rdquo;
          </blockquote>
          <p className="text-[11px] tracking-[0.25em] uppercase text-text-muted">
            &mdash; {t("author")}
          </p>
          <div className="w-16 h-px bg-gold mx-auto mt-16" />
        </motion.div>
      </div>
    </section>
  );
}
