"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useRef } from "react";

// -- animation config --

const WORD_STAGGER = 0.12;
const WORD_DURATION = 0.7;
const WORD_INITIAL_Y = 60;

const taglineContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: WORD_STAGGER,
      delayChildren: 0.3,
    },
  },
};

const wordReveal = {
  hidden: { opacity: 0, y: WORD_INITIAL_Y },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: WORD_DURATION,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

// Timing: tagline starts at 0.3s, each word takes 0.12s stagger.
// "Din anledning. Vår kvalitet." = 4 words => last word starts at 0.3 + 0.36 = 0.66s
// + 0.7s duration = tagline finishes ~1.36s. We start subtitle at ~1.4s.
const SUBTITLE_DELAY = 1.5;
const CTA_DELAY = 2.0;
const SCROLL_DELAY = 2.6;
const BOTTOM_LINE_DELAY = 2.0;

export function Hero() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: text moves up faster than scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const tagline = t("tagline");
  const words = tagline.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background"
    >
      {/* Noise/grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Radial gold glow behind text area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] bg-gold/[0.03] blur-[120px]"
      />

      {/* Secondary smaller glow, slightly offset */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, delay: 1 }}
        className="absolute top-[40%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gold/[0.02] blur-[100px]"
      />

      {/* Main content with parallax */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Tagline — staggered word reveal */}
        <motion.h1
          variants={taglineContainer}
          initial="hidden"
          animate="visible"
          className="font-display font-light text-6xl md:text-8xl xl:text-9xl text-text-primary leading-[1.05] tracking-[-0.02em] mb-8 md:mb-10"
        >
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
              <motion.span
                variants={wordReveal}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Subtitle — fades in after tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: SUBTITLE_DELAY,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="font-body text-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 md:mb-14 leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA Button — fades in with subtle scale */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.7,
            delay: CTA_DELAY,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <Button href="/kontakt" size="large">
            {t("cta")} →
          </Button>
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

        {/* Animated gold pulse line */}
        <div className="relative w-px h-10 overflow-hidden">
          <motion.div
            animate={{
              y: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.3,
            }}
            className="absolute inset-x-0 h-full bg-gradient-to-b from-transparent via-gold to-transparent"
          />
          <div className="absolute inset-0 bg-gold/10" />
        </div>
      </motion.div>

      {/* Bottom gold line — full width, thin, with opacity animation */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{
          duration: 1.2,
          delay: BOTTOM_LINE_DELAY,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="absolute bottom-0 left-0 right-0 z-10"
      >
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
