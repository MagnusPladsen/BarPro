"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ColorOrbs } from "@/components/ui/ColorOrbs";

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
            className="text-[11px] tracking-[0.25em] uppercase text-accent font-body font-medium mb-6"
          >
            {t("hero.label")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="font-display italic font-light text-4xl md:text-5xl lg:text-6xl text-text-primary"
          >
            {t("hero.heading")}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6 items-center">
          {packageKeys.map((key, i) => {
            const isPopular = key === "premium";

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease }}
                className={`relative border text-center transition-all duration-500 ${
                  isPopular
                    ? "border-accent/40 bg-background-card shadow-[0_0_80px_rgba(184,142,100,0.1)] hover:shadow-[0_0_100px_rgba(184,142,100,0.15)] p-10 lg:p-14 md:-my-6"
                    : "border-border bg-background-card/50 hover:border-border-accent p-10 lg:p-12"
                }`}
              >
                <div className="absolute inset-0 overflow-hidden"><ColorOrbs size="small" intensity={isPopular ? 0.5 : 0.2} /></div>
                {isPopular && (
                  <>
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-background text-[10px] tracking-[0.2em] uppercase font-medium px-6 py-2">
                      {t("packages.premium.popular")}
                    </span>
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                  </>
                )}

                <h3 className={`font-display italic font-light text-text-primary mb-2 relative z-10 ${isPopular ? "text-3xl" : "text-2xl"}`}>
                  {t(`packages.${key}.name`)}
                </h3>
                <p className="text-text-muted text-sm mb-6 relative z-10">
                  {t(`packages.${key}.description`)}
                </p>
                <div className="relative z-10">
                  <span className={`font-display font-light ${isPopular ? "text-5xl lg:text-6xl text-accent" : "text-3xl lg:text-4xl text-text-primary"}`}>
                    {t(`packages.${key}.price`)}
                  </span>
                  <span className={`text-sm ml-2 ${isPopular ? "text-accent/60" : "text-text-muted"}`}>
                    {t(`packages.${key}.unit`)}
                  </span>
                </div>
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
