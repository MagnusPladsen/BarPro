"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Animated background shapes that parallax on scroll.
 * More visible than before — creates real depth.
 */
export function ScrollBackground() {
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const y4 = useTransform(scrollYProgress, [0, 1], [100, -350]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [15, -45]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.3, 0.9]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.08, 0.15, 0.12, 0.06]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Large rotating diamond */}
      <motion.div
        style={{ y: y1, rotate: rotate1, scale: scale1, opacity: opacity1 }}
        className="absolute top-[15%] right-[-8%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] border border-accent/30"
      />

      {/* Counter-rotating rectangle */}
      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        className="absolute top-[50%] left-[-5%] w-[180px] h-[120px] md:w-[350px] md:h-[220px] border border-accent/10"
      />

      {/* Small square — fastest parallax */}
      <motion.div
        style={{ y: y2, rotate: rotate1 }}
        className="absolute top-[75%] right-[10%] w-[80px] h-[80px] md:w-[150px] md:h-[150px] border border-accent/15"
      />

      {/* Horizontal accent line */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[35%] left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent"
      />

      {/* Second horizontal line — different speed */}
      <motion.div
        style={{ y: y4 }}
        className="absolute top-[65%] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-accent/8 to-transparent"
      />

      {/* Large glow orb — drifts with scroll */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[70%] right-[10%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-accent/[0.04] blur-[120px]"
      />

      {/* Second glow orb — left side */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[40%] left-[5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-[#2A211A]/30 blur-[100px]"
      />
    </div>
  );
}
