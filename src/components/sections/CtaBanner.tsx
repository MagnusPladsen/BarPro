"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const ease = [0.16, 1, 0.3, 1] as const;

export function CtaBanner() {
  const t = useTranslations("ctaBanner");

  return (
    <section className="py-40 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease }}
          className="relative border border-border hover:border-border-gold bg-background-card p-20 md:p-28 overflow-hidden corner-accents transition-colors duration-700"
        >
          {/* Subtle gold glow behind */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/[0.04] blur-3xl -translate-y-1/2 pointer-events-none" />

          {/* Ambient gold side glows */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[200px] h-[400px] bg-gold/[0.02] blur-[80px] pointer-events-none" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[200px] h-[400px] bg-gold/[0.02] blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <div className="w-16 h-px bg-gold mx-auto mb-12" />
            <h2 className="font-display font-light text-3xl md:text-4xl lg:text-5xl text-text-primary mb-6 leading-[1.1]">
              {t("heading")}
            </h2>
            <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              {t("text")}
            </p>
            <p className="text-text-muted/70 text-sm italic mb-12 max-w-lg mx-auto">
              {t("tagline")}
            </p>
            <Button href="/kontakt" size="large">
              {t("cta")} &rarr;
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
