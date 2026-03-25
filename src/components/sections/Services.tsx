"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const serviceKeys = ["bartenders", "drinks", "fullService"] as const;

const ease = [0.16, 1, 0.3, 1] as const;

export function Services() {
  const t = useTranslations("services");

  return (
    <section className="py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="text-[11px] tracking-[0.25em] uppercase text-accent font-body font-medium mb-6"
          >
            {t("label")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="font-display italic font-light text-4xl md:text-5xl lg:text-6xl text-text-primary"
          >
            {t("heading")}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -40, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: i * 0.2, ease }}
              className="group relative bg-background-card border border-border border-l-2 border-l-accent p-10 hover:border-border-accent hover:shadow-[0_0_60px_rgba(184,142,100,0.06)] transition-all duration-500"
            >
              {/* Step number watermark */}
              <span className="absolute top-6 right-8 font-display text-5xl text-accent/[0.07] select-none leading-none group-hover:text-accent/[0.12] transition-colors duration-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="w-8 h-px bg-accent mb-8 group-hover:w-12 transition-all duration-500" />
              <h3 className="font-display font-light text-2xl text-text-primary mb-5">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-text-muted leading-relaxed">
                {t(`items.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease }}
          className="text-center mt-20"
        >
          <Button href="/tjenester" variant="outline">
            {t("viewAll")} &rarr;
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
