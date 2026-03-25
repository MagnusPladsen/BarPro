"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const faqKeys = ["whatIncluded", "alcohol", "howFar", "howBook", "cancel", "nonAlcoholic"] as const;

const ease = [0.16, 1, 0.3, 1] as const;

export function Faq() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-40 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20">
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

        <div className="space-y-0">
          {faqKeys.map((key, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease }}
                className="border-b border-border"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-7 text-left cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-light text-lg md:text-xl text-text-primary group-hover:text-accent transition-colors duration-300 pr-8">
                    {t(`items.${key}.q`)}
                  </span>
                  <span className={`text-accent text-xl transition-transform duration-300 shrink-0 ${isOpen ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-text-muted leading-relaxed pb-7 pr-12">
                        {t(`items.${key}.a`)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
