"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin copper progress bar that fills from left to right as user scrolls.
 * Fixed below the header/announcement bar.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-[76px] left-0 right-0 z-[55] h-[2px] bg-gradient-to-r from-accent-dim via-accent to-accent-hover"
    />
  );
}
