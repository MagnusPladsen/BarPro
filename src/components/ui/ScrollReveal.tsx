"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Blur-to-focus reveal on scroll. Content starts blurred and sharpens.
 */
export function BlurReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.6"],
  });
  const blur = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        filter: blur.get() > 0.5 ? `blur(${blur.get()}px)` : "none",
        opacity,
        y,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Word-by-word reveal on scroll. Each word fades in sequentially.
 */
export function ScrollTextReveal({
  text,
  className = "",
  wordClassName = "",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.4"],
  });

  const words = text.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => (
        <ScrollWord
          key={i}
          word={word}
          progress={scrollYProgress}
          index={i}
          total={words.length}
          className={wordClassName}
        />
      ))}
    </div>
  );
}

function ScrollWord({
  word,
  progress,
  index,
  total,
  className,
}: {
  word: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  index: number;
  total: number;
  className: string;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const y = useTransform(progress, [start, end], [5, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block mr-[0.25em] last:mr-0 ${className}`}
    >
      {word}
    </motion.span>
  );
}

/**
 * Parallax section — content moves at a different rate than scroll.
 */
export function ParallaxSection({
  children,
  speed = 0.3,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
