"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Animated background shapes that move at different parallax speeds on scroll.
 * Creates depth and visual interest as user scrolls through the page.
 */
export function ScrollBackground() {
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.9]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Large diamond shape — moves slowly */}
      <motion.div
        style={{ y: y1, rotate: rotate1, scale: scale1 }}
        className="absolute top-[20%] right-[-5%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] border border-accent/[0.03] opacity-40"
      />

      {/* Smaller rectangle — moves faster */}
      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        className="absolute top-[60%] left-[-3%] w-[200px] h-[150px] md:w-[350px] md:h-[250px] border border-accent/[0.04] opacity-30"
      />

      {/* Horizontal accent line that shifts on scroll */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[40%] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-accent/[0.04] to-transparent"
      />

      {/* Subtle glow orb that drifts */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[80%] right-[15%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-accent/[0.015] blur-[100px]"
      />
    </div>
  );
}
