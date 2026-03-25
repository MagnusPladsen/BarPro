"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useRef } from "react";

// -- animation config --
const LINE_STAGGER = 0.25;
const LINE_DURATION = 0.8;
const LINE_INITIAL_Y = 80;

const taglineContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: LINE_STAGGER,
      delayChildren: 0.4,
    },
  },
};

const lineReveal = {
  hidden: { opacity: 0, y: LINE_INITIAL_Y },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: LINE_DURATION,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const SUBTITLE_DELAY = 1.4;
const CTA_DELAY = 1.9;
const SCROLL_DELAY = 2.6;
const BOTTOM_LINE_DELAY = 2.0;

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

      {/* Animated gradient mesh orbs */}
      <motion.div style={{ y: orbY, scale: orbScale }} className="absolute inset-0 pointer-events-none">
        {/* Primary large orb — copper, big movement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
          className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={{
              x: [0, 80, -60, 40, -30, 0],
              y: [0, -50, 40, -30, 20, 0],
              scale: [1, 1.25, 0.85, 1.15, 0.95, 1],
            }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="w-[400px] h-[400px] md:w-[700px] md:h-[700px] bg-accent/[0.12] blur-[100px]"
          />
        </motion.div>

        {/* Secondary orb — warm espresso, counter-drift */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.6 }}
          className="absolute top-[55%] left-[25%] -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={{
              x: [0, -70, 50, -30, 60, 0],
              y: [0, 50, -40, 30, -20, 0],
              scale: [1, 0.8, 1.3, 0.9, 1.1, 1],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="w-[350px] h-[350px] md:w-[550px] md:h-[550px] bg-[#2A211A]/50 blur-[90px]"
          />
        </motion.div>

        {/* Tertiary accent orb — brighter, faster */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute top-[25%] left-[70%] -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={{
              x: [0, 60, -80, 40, -50, 0],
              y: [0, -70, 30, -50, 20, 0],
              scale: [1, 1.4, 0.7, 1.2, 0.9, 1],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-accent/[0.15] blur-[80px]"
          />
        </motion.div>

        {/* Deep warm orb — large, slow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 1.3 }}
          className="absolute top-[65%] left-[75%] -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={{
              x: [0, -50, 70, -30, 40, 0],
              y: [0, 40, -60, 30, -20, 0],
              scale: [1, 1.3, 0.85, 1.15, 0.9, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-[#1A1018]/40 blur-[80px]"
          />
        </motion.div>

        {/* Fifth orb — drifts wide, very visible */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.6 }}
          className="absolute top-[40%] left-[15%] -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={{
              x: [0, 100, -40, 70, -60, 0],
              y: [0, -30, 50, -40, 20, 0],
              scale: [0.8, 1.2, 0.7, 1.3, 0.9, 0.8],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-accent/[0.1] blur-[100px]"
          />
        </motion.div>

        {/* Sixth orb — top left, deep teal for contrast */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5, delay: 0.5 }}
          className="absolute top-[12%] left-[18%] -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={{
              x: [0, -50, 30, -70, 40, 0],
              y: [0, 40, -30, 20, -50, 0],
              scale: [1, 1.3, 0.8, 1.1, 0.9, 1],
            }}
            transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
            className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-[#3A6B6B]/15 blur-[90px]"
          />
        </motion.div>
      </motion.div>

      {/* Decorative corner frame */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2.2 }}
        className="absolute inset-12 md:inset-20 lg:inset-28 z-10 pointer-events-none"
      >
        <div className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 border-t border-l border-accent/20" />
        <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 border-t border-r border-accent/20" />
        <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16 border-b border-l border-accent/20" />
        <div className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 border-b border-r border-accent/20" />
      </motion.div>

      {/* Main content with enhanced parallax */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Heritage badge */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-accent/40 text-[9px] md:text-[11px] tracking-[0.25em] uppercase font-body font-medium mb-6 md:mb-8"
        >
          {t("heritage")}
        </motion.p>

        {/* Tagline — contrast typography */}
        <motion.h1
          variants={taglineContainer}
          initial="hidden"
          animate="visible"
          className="mb-8 md:mb-10"
        >
          {/* Line 1: Italic serif */}
          <span className="block overflow-hidden">
            <motion.span
              variants={lineReveal}
              className="block font-display italic font-normal text-5xl md:text-7xl xl:text-8xl text-text-primary leading-[1.05]"
            >
              {t("tagline1")}
            </motion.span>
          </span>
          {/* Line 2: Uppercase sans */}
          <span className="block overflow-hidden">
            <motion.span
              variants={lineReveal}
              className="block font-body font-extralight text-4xl md:text-6xl xl:text-7xl text-text-primary leading-[1.05] tracking-[0.05em] uppercase"
            >
              {t("tagline2")}
            </motion.span>
          </span>
        </motion.h1>

        {/* Subtitle — fades in after tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: SUBTITLE_DELAY,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-body text-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 md:mb-14 leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.7,
            delay: CTA_DELAY,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/tjenester" size="large">
              {t("ctaServices")}
            </Button>
            <Button href="/priser" variant="outline" size="large">
              {t("ctaPricing")}
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: CTA_DELAY + 0.5 }}
            className="mt-8"
          >
            <a href="/kontakt" className="text-text-muted text-sm hover:text-accent transition-colors duration-300">
              {t("cta")} &rarr;
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: SCROLL_DELAY }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
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
      </motion.div>

      {/* Bottom accent line */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.2, delay: BOTTOM_LINE_DELAY, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 z-10"
      >
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="h-px w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
