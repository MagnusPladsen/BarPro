"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ColorOrbs } from "@/components/ui/ColorOrbs";

const ease = [0.16, 1, 0.3, 1] as const;

export function BookingCallout() {
  const t = useTranslations("bookingCallout");

  return (
    <section className="py-6 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="max-w-5xl mx-auto"
      >
        <div className="relative border border-accent/20 bg-accent/[0.03] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <ColorOrbs size="small" intensity={0.5} />

          <div className="relative z-10 text-center md:text-left">
            <h3 className="font-display font-light text-2xl md:text-3xl text-text-primary mb-2">
              {t("heading")}
            </h3>
            <p className="text-text-muted text-sm md:text-base">
              {t("text")}
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Button href="/bestill" size="large">
              {t("cta")} &rarr;
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
