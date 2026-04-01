"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useRef } from "react";

export function Hero() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background"
    >
      {/* Noise/grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* 3 massive overlapping orbs */}
      <motion.div style={{ y: orbY, scale: orbScale }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{
              x: [0, 50, -30, 40, -20, 0],
              y: [0, -30, 20, -15, 25, 0],
              scale: [1, 1.1, 0.95, 1.05, 0.98, 1],
              opacity: [0.14, 0.2, 0.12, 0.18, 0.13, 0.14],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="w-[120vw] h-[120vh] bg-[#B88E64] blur-[150px]"
            style={{ opacity: 0.14 }}
          />
        </div>
        <div className="absolute top-[15%] left-[10%] -translate-x-1/4 -translate-y-1/4">
          <motion.div
            animate={{
              x: [0, -40, 30, -25, 15, 0],
              y: [0, 25, -20, 30, -10, 0],
              scale: [1, 1.15, 0.9, 1.08, 0.95, 1],
              opacity: [0.1, 0.16, 0.07, 0.13, 0.09, 0.1],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="w-[80vw] h-[80vh] bg-[#3A6B6B] blur-[130px]"
            style={{ opacity: 0.1 }}
          />
        </div>
        <div className="absolute bottom-[10%] right-[5%] translate-x-1/4 translate-y-1/4">
          <motion.div
            animate={{
              x: [0, 30, -40, 20, -30, 0],
              y: [0, -20, 30, -25, 15, 0],
              scale: [1, 1.1, 0.92, 1.12, 0.88, 1],
              opacity: [0.1, 0.15, 0.08, 0.13, 0.09, 0.1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="w-[80vw] h-[80vh] bg-[#6B2A35] blur-[130px]"
            style={{ opacity: 0.1 }}
          />
        </div>
      </motion.div>

      {/* Main content with parallax */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        <p className="text-accent/40 text-[9px] md:text-[11px] tracking-[0.25em] uppercase font-body font-medium mb-6 md:mb-8">
          {t("heritage")}
        </p>

        <h1 className="mb-8 md:mb-10">
          <span className="block font-display italic font-normal text-5xl md:text-7xl xl:text-8xl text-text-primary leading-[1.05]">
            {t("tagline1")}
          </span>
          <span className="block font-body font-extralight text-4xl md:text-6xl xl:text-7xl text-text-primary leading-[1.05] tracking-[0.05em] uppercase">
            {t("tagline2")}
          </span>
        </h1>

        <p className="font-body text-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 md:mb-14 leading-relaxed">
          {t("subtitle")}
        </p>

        <div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/tjenester" size="large">
              {t("ctaServices")}
            </Button>
            <Button href="/priser" variant="outline" size="large">
              {t("ctaPricing")}
            </Button>
          </div>
          <div className="mt-8">
            <a href="/kontakt" className="text-text-muted text-sm hover:text-accent transition-colors duration-300">
              {t("cta")} &rarr;
            </a>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="font-body text-text-muted text-[10px] uppercase tracking-[0.3em]">
          {t("scroll")}
        </span>
        <div className="relative w-px h-10 overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.3 }}
            className="absolute inset-x-0 h-full bg-gradient-to-b from-transparent via-accent to-transparent"
          />
          <div className="absolute inset-0 bg-accent/10" />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="h-px w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        />
      </div>
    </section>
  );
}
