"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const ease = [0.16, 1, 0.3, 1] as const;

const packageKeys = ["basis", "premium", "eksklusiv"] as const;

export function PricingTeaser() {
  const t = useTranslations("pricingPage");

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
            {t("hero.label")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-text-primary"
          >
            {t("hero.heading")}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {packageKeys.map((key, i) => {
            const isPopular = key === "premium";

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease }}
                className={`relative border p-10 lg:p-12 text-center ${
                  isPopular
                    ? "border-gold/40 bg-background-card"
                    : "border-border bg-background-card/50"
                }`}
              >
                {isPopular && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-background text-[10px] tracking-[0.2em] uppercase font-medium px-4 py-1.5">
                    {t("packages.premium.popular")}
                  </span>
                )}

                <h3 className="font-display font-light text-2xl text-text-primary mb-2">
                  {t(`packages.${key}.name`)}
                </h3>
                <p className="text-text-muted text-sm mb-6">
                  {t(`packages.${key}.description`)}
                </p>
                <span className="font-display text-3xl lg:text-4xl font-light text-text-primary">
                  {t(`packages.${key}.price`)}
                </span>
                <span className="text-text-muted text-sm ml-2">
                  {t(`packages.${key}.unit`)}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease }}
          className="text-center mt-20"
        >
          <Button href="/priser" variant="outline">
            {t("viewAll")} &rarr;
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
