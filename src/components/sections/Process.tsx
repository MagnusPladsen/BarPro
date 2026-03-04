"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const stepKeys = ["tell", "tailor", "deliver"] as const;

const ease = [0.16, 1, 0.3, 1] as const;

export function Process() {
  const t = useTranslations("process");

  return (
    <section className="py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="text-[11px] tracking-[0.25em] uppercase text-gold font-body font-medium mb-6"
          >
            {t("label")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-text-primary"
          >
            {t("heading")}
          </motion.h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {/* Gold connecting line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          {stepKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.2, ease }}
              className="relative text-center"
            >
              <div className="relative mb-10">
                <span className="font-display text-6xl md:text-7xl lg:text-8xl text-gold/20 leading-none select-none">
                  {t(`steps.${key}.number`)}
                </span>
              </div>
              <h3 className="font-display font-light text-2xl text-text-primary mb-4">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="text-text-muted leading-relaxed max-w-xs mx-auto">
                {t(`steps.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
