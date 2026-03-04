"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const ease = [0.16, 1, 0.3, 1] as const;

const packageKeys = ["basis", "premium", "eksklusiv"] as const;
const serviceKeys = [
  "bartender",
  "signatureDrink",
  "extraHour",
  "tasting",
  "nonAlcoholic",
  "travel",
] as const;

export default function PriserPage() {
  const t = useTranslations("pricingPage");

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
            className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-text-primary mb-8 leading-[1.1]"
          >
            {t("hero.heading")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            {t("hero.text")}
          </motion.p>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="text-[11px] tracking-[0.25em] uppercase text-gold mb-16 text-center"
          >
            {t("packages.label")}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
            {packageKeys.map((key, i) => {
              const features = t.raw(
                `packages.${key}.features`
              ) as string[];
              const isPopular = key === "premium";

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease }}
                  className={`relative border p-10 lg:p-12 flex flex-col ${
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

                  <h3 className="font-display font-light text-2xl text-text-primary mb-3">
                    {t(`packages.${key}.name`)}
                  </h3>
                  <p className="text-text-muted text-sm mb-8">
                    {t(`packages.${key}.description`)}
                  </p>

                  <div className="mb-10">
                    <span className="font-display text-4xl lg:text-5xl font-light text-text-primary">
                      {t(`packages.${key}.price`)}
                    </span>
                    <span className="text-text-muted text-sm ml-2">
                      {t(`packages.${key}.unit`)}
                    </span>
                  </div>

                  <div className="w-full h-px bg-border mb-8" />

                  <ul className="space-y-4 mb-12 flex-1">
                    {features.map((feature, fi) => (
                      <li
                        key={fi}
                        className="flex items-start gap-3 text-text-muted text-sm"
                      >
                        <span className="text-gold shrink-0 mt-0.5">—</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    href="/kontakt"
                    variant={isPopular ? "primary" : "outline"}
                    className="w-full"
                  >
                    {t("cta.button")}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Per-service pricing */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="text-[11px] tracking-[0.25em] uppercase text-gold mb-6 text-center"
          >
            {t("services.label")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display font-light text-3xl md:text-4xl text-text-primary mb-4 text-center"
          >
            {t("services.heading")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="text-text-muted text-lg text-center mb-16 max-w-2xl mx-auto"
          >
            {t("services.text")}
          </motion.p>

          <div className="space-y-0">
            {serviceKeys.map((key, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06, ease }}
                className="flex items-start justify-between gap-8 py-6 border-b border-border first:border-t"
              >
                <div>
                  <h3 className="text-text-primary font-medium text-base mb-1">
                    {t(`services.items.${key}.name`)}
                  </h3>
                  <p className="text-text-muted text-sm">
                    {t(`services.items.${key}.description`)}
                  </p>
                </div>
                <span className="text-gold font-body text-sm tracking-wide whitespace-nowrap shrink-0 pt-0.5">
                  {t(`services.items.${key}.price`)}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="text-text-muted/50 text-xs text-center mt-10"
          >
            {t("note")}
          </motion.p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease }}
            className="relative border border-border bg-background-card p-20 overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gold/[0.04] blur-3xl -translate-y-1/2 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-16 h-px bg-gold mx-auto mb-12" />
              <h2 className="font-display font-light text-3xl md:text-4xl text-text-primary mb-6">
                {t("cta.heading")}
              </h2>
              <p className="text-text-muted text-lg mb-12 max-w-xl mx-auto leading-relaxed">
                {t("cta.text")}
              </p>
              <Button href="/kontakt" size="large">
                {t("cta.button")} &rarr;
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
