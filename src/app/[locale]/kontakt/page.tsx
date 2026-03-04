"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact/ContactForm";

const ease = [0.16, 1, 0.3, 1] as const;

export default function ContactPage() {
  const t = useTranslations("contactPage");

  return (
    <>
      {/* Hero */}
      <section className="pt-48 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
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
            className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-text-primary"
          >
            {t("hero.heading")}
          </motion.h1>
        </div>
      </section>

      {/* Form + Contact Info */}
      <section className="pb-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="lg:col-span-3"
            >
              <div className="bg-background-card border border-border p-10 md:p-14">
                <ContactForm />
              </div>
            </motion.div>

            {/* Direct Contact */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease }}
              className="lg:col-span-2"
            >
              <div className="sticky top-32">
                <h2 className="font-display font-light text-2xl text-text-primary mb-10">
                  {t("direct.heading")}
                </h2>

                <div className="space-y-10">
                  <div>
                    <p className="text-[11px] tracking-[0.15em] uppercase text-text-muted mb-3">
                      {t("direct.email")}
                    </p>
                    <a
                      href="mailto:Barproda@gmail.com"
                      className="text-text-primary hover:text-gold transition-colors duration-300"
                    >
                      Barproda@gmail.com
                    </a>
                  </div>

                  <div>
                    <p className="text-[11px] tracking-[0.15em] uppercase text-text-muted mb-3">
                      {t("direct.phone")}
                    </p>
                    <div className="space-y-4">
                      <div>
                        <span className="text-text-muted text-sm">
                          {t("direct.emilName")}
                        </span>
                        <br />
                        <a
                          href="tel:+4790225293"
                          className="text-text-primary hover:text-gold transition-colors duration-300"
                        >
                          902 25 293
                        </a>
                      </div>
                      <div>
                        <span className="text-text-muted text-sm">
                          {t("direct.sofieName")}
                        </span>
                        <br />
                        <a
                          href="tel:+4747604766"
                          className="text-text-primary hover:text-gold transition-colors duration-300"
                        >
                          476 04 766
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative gold line */}
                <div className="w-10 h-px bg-gold mt-14" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
