"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Blurred gradient orbs that move with scroll parallax.
 * Each orb is absolutely positioned and transforms on scroll.
 */
export function ScrollBackground() {
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], ["0vh", "-60vh"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0vh", "-90vh"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0vh", "-45vh"]);
  const y4 = useTransform(scrollYProgress, [0, 1], ["0vh", "-75vh"]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.4, 0.8]);
  const scale2 = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 0.7, 1.3]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {/* Copper orb — right side */}
      <motion.div
        style={{ y: y1, scale: scale1 }}
        className="absolute top-[40vh] right-[-5vw] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#B88E64] opacity-[0.07] blur-[120px]"
      />

      {/* Dark warm orb — left side */}
      <motion.div
        style={{ y: y2, scale: scale2 }}
        className="absolute top-[80vh] left-[-8vw] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] bg-[#2A211A] opacity-[0.2] blur-[100px]"
      />

      {/* Bright copper — center-right, deeper */}
      <motion.div
        style={{ y: y4 }}
        className="absolute top-[130vh] right-[10vw] w-[40vw] h-[40vw] max-w-[450px] max-h-[450px] bg-[#B88E64] opacity-[0.09] blur-[90px]"
      />

      {/* Espresso glow — left, mid-page */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[180vh] left-[5vw] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] bg-[#1A1410] opacity-[0.25] blur-[110px]"
      />

      {/* Small copper accent — far down right */}
      <motion.div
        style={{ y: y1, scale: scale2 }}
        className="absolute top-[240vh] right-[0vw] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] bg-[#B88E64] opacity-[0.06] blur-[100px]"
      />

      {/* Deep warm — bottom left */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[300vh] left-[20vw] w-[50vw] h-[50vw] max-w-[550px] max-h-[550px] bg-[#2A211A] opacity-[0.15] blur-[100px]"
      />
    </div>
  );
}
