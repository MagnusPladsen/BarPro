"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

const serviceBlocks = [
  {
    key: "bartenders",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
  },
  {
    key: "drinks",
    image:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
  },
  {
    key: "fullService",
    image:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
  },
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 as const },
  transition: { duration: 0.8, ease },
};

export default function TjenesterPage() {
  const t = useTranslations();

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
            {t("servicesPage.hero.label")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-text-primary mb-8 leading-[1.1]"
          >
            {t("servicesPage.hero.heading")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            {t("servicesPage.hero.text")}
          </motion.p>
        </div>
      </section>

      {/* Service Blocks */}
      {serviceBlocks.map((service, index) => {
        const isReversed = index % 2 !== 0;
        const points = t.raw(
          `servicesPage.${service.key}.points`
        ) as string[];

        return (
          <section key={service.key} className="py-24 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image */}
              <motion.div
                {...fadeUp}
                className={`relative aspect-[4/3] overflow-hidden ${
                  isReversed ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={service.image}
                  alt={t(`servicesPage.${service.key}.title`)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.15, ease }}
                className={isReversed ? "lg:order-1" : ""}
              >
                <h2 className="font-display font-light text-3xl md:text-4xl text-text-primary mb-6">
                  {t(`servicesPage.${service.key}.title`)}
                </h2>
                <p className="text-text-muted text-lg leading-relaxed mb-10">
                  {t(`servicesPage.${service.key}.text`)}
                </p>
                <ul className="space-y-4">
                  {points.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 0.3 + i * 0.08,
                        ease,
                      }}
                      className="flex items-start gap-4 text-text-muted"
                    >
                      <span className="text-gold shrink-0 mt-0.5">—</span>
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </section>
        );
      })}

      {/* Pricing Section */}
      <section className="py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            {...fadeUp}
            className="text-[11px] tracking-[0.25em] uppercase text-gold mb-6"
          >
            {t("servicesPage.pricing.label")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-text-primary mb-8"
          >
            {t("servicesPage.pricing.heading")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="text-text-muted text-lg leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            {t("servicesPage.pricing.text")}
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="space-y-4 mb-14 max-w-lg mx-auto text-left"
          >
            {(
              t.raw("servicesPage.pricing.factors") as string[]
            ).map((factor, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + i * 0.08,
                  ease,
                }}
                className="flex items-start gap-4 text-text-muted"
              >
                <span className="text-gold shrink-0 mt-0.5">—</span>
                <span>{factor}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            <Button href="/priser" size="large">
              {t("servicesPage.pricing.cta")} &rarr;
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
