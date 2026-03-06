"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";

const occasionData = [
  {
    key: "wedding",
    image:
      "https://images.unsplash.com/photo-1470338745628-171cf53de3a8?w=800&q=80",
  },
  {
    key: "corporate",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  },
  {
    key: "private",
    image:
      "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&q=80",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Occasions() {
  const t = useTranslations("occasions");

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {occasionData.map(({ key, image }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: i * 0.15, ease }}
              className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
            >
              <Image
                src={image}
                alt={t(`items.${key}.title`)}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent transition-opacity duration-500 group-hover:from-background/95" />
              {/* Top gold accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/0 to-transparent group-hover:via-gold/60 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="w-6 h-px bg-gold mb-4 transition-all duration-500 group-hover:w-12" />
                <h3 className="font-display font-light text-2xl md:text-3xl text-text-primary mb-3">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {t(`items.${key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
