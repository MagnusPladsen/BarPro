"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Blurred gradient orbs that parallax on scroll.
 * Uses absolute positioning inside body-level wrapper instead of fixed,
 * which avoids browser rendering issues with fixed + blur + transform.
 */
export function ScrollBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Different speeds create parallax depth
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -800]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -1200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -1000]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 0.8]);
  const scale2 = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 0.7, 1.4]);

  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 w-full pointer-events-none overflow-hidden"
      style={{ height: "500vh", zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Copper glow — right */}
      <motion.div
        style={{ y: y1, scale: scale1 }}
        className="absolute top-[15%] right-[-5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px]"
      >
        <div className="w-full h-full bg-[#B88E64] opacity-[0.07] blur-[120px]" />
      </motion.div>

      {/* Dark espresso — left */}
      <motion.div
        style={{ y: y2, scale: scale2 }}
        className="absolute top-[25%] left-[-8%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px]"
      >
        <div className="w-full h-full bg-[#2A211A] opacity-[0.25] blur-[100px]" />
      </motion.div>

      {/* Bright copper — center right */}
      <motion.div
        style={{ y: y4 }}
        className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] max-w-[450px] max-h-[450px]"
      >
        <div className="w-full h-full bg-[#B88E64] opacity-[0.09] blur-[90px]" />
      </motion.div>

      {/* Warm deep — left mid */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[55%] left-[5%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px]"
      >
        <div className="w-full h-full bg-[#1A1410] opacity-[0.3] blur-[110px]" />
      </motion.div>

      {/* Copper accent — far right */}
      <motion.div
        style={{ y: y1, scale: scale2 }}
        className="absolute top-[70%] right-[0%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px]"
      >
        <div className="w-full h-full bg-[#B88E64] opacity-[0.06] blur-[100px]" />
      </motion.div>

      {/* Deep warm — bottom */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[85%] left-[25%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px]"
      >
        <div className="w-full h-full bg-[#2A211A] opacity-[0.18] blur-[100px]" />
      </motion.div>
    </div>
  );
}
