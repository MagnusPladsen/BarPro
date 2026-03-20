"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function PersonvernPage() {
  const t = useTranslations("privacyPage");

  const sections = ["intro", "whatWeCollect", "whyWeCollect", "storage", "sharing", "rights", "cookies", "contact"] as const;

  return (
    <section className="pt-48 pb-40 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="text-[11px] tracking-[0.25em] uppercase text-gold mb-6"
        >
          {t("label")}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="font-display font-light text-4xl md:text-5xl text-text-primary leading-[1.1] mb-16"
        >
          {t("heading")}
        </motion.h1>

        <div className="space-y-12">
          {sections.map((section) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
              <h2 className="font-display font-light text-xl text-text-primary mb-4">
                {t(`sections.${section}.title`)}
              </h2>
              <p className="text-text-muted leading-relaxed">
                {t(`sections.${section}.text`)}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-text-muted/50 text-sm mt-16"
        >
          {t("lastUpdated")}
        </motion.p>
      </div>
    </section>
  );
}
