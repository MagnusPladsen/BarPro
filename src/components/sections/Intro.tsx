"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export function Intro() {
  const t = useTranslations("intro");
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.02, 1]);

  return (
    <section className="py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease }}
              className="text-[11px] tracking-[0.25em] uppercase text-gold font-body font-medium mb-6"
            >
              {t("label")}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.1, ease }}
              className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-text-primary mb-10 leading-[1.1]"
            >
              {t("heading")}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.15, ease }}
              className="w-12 h-px bg-gold mb-10"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.2, ease }}
              className="text-text-muted text-lg leading-relaxed max-w-lg"
            >
              {t("text")}
            </motion.p>
          </div>

          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, delay: 0.3, ease }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              className="absolute inset-0"
            >
              <Image
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80"
                alt={t("heading")}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/10 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
