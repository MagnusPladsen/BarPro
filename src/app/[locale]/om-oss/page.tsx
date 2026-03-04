"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 as const },
  transition: { duration: 0.8, ease },
};

const teamMembers = ["emil", "sofie"] as const;
const valueKeys = ["quality", "customization", "presence"] as const;

export default function OmOssPage() {
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
            {t("aboutPage.hero.label")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-text-primary leading-[1.1]"
          >
            {t("aboutPage.hero.heading")}
          </motion.h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Column */}
          <motion.div {...fadeUp}>
            <p className="text-text-muted text-lg leading-relaxed mb-6">
              {t("aboutPage.story.text1")}
            </p>
            <p className="text-text-muted text-lg leading-relaxed">
              {t("aboutPage.story.text2")}
            </p>
          </motion.div>

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="relative aspect-[4/3] overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80"
              alt={t("aboutPage.hero.heading")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.p
              {...fadeUp}
              className="text-[11px] tracking-[0.25em] uppercase text-gold mb-6"
            >
              {t("aboutPage.team.label")}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-text-primary"
            >
              {t("aboutPage.team.heading")}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: i * 0.15, ease }}
                className="bg-background-card border border-border p-10"
              >
                {/* Avatar Placeholder */}
                <div className="w-24 h-24 bg-background border border-border flex items-center justify-center mb-8">
                  <span className="font-display text-2xl text-gold">
                    {t(`aboutPage.team.${member}.name`)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>

                <h3 className="font-display font-light text-2xl text-text-primary mb-2">
                  {t(`aboutPage.team.${member}.name`)}
                </h3>
                <p className="text-gold text-[11px] tracking-[0.25em] uppercase mb-6">
                  {t(`aboutPage.team.${member}.role`)}
                </p>
                <p className="text-text-muted leading-relaxed">
                  {t(`aboutPage.team.${member}.bio`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.p
              {...fadeUp}
              className="text-[11px] tracking-[0.25em] uppercase text-gold mb-6"
            >
              {t("aboutPage.values.label")}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-text-primary"
            >
              {t("aboutPage.values.heading")}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueKeys.map((key, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: i * 0.12, ease }}
                className="bg-background-card border border-border p-10"
              >
                {/* Gold accent line */}
                <div className="w-10 h-px bg-gold mb-8" />

                <h3 className="font-display font-light text-2xl text-text-primary mb-4">
                  {t(`aboutPage.values.${key}.title`)}
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {t(`aboutPage.values.${key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
