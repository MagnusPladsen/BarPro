"use client";

import { motion } from "framer-motion";

/**
 * Reusable 3-color blur orbs (copper, teal, burgundy).
 * Same as hero but configurable size. Use inside relative/overflow-hidden containers.
 */
export function ColorOrbs({ size = "full", intensity = 1 }: { size?: "full" | "medium" | "small"; intensity?: number }) {
  const sizes = {
    full: { copper: "w-[120vw] h-[120vh]", teal: "w-[80vw] h-[80vh]", burgundy: "w-[80vw] h-[80vh]", blur: "blur-[150px]" },
    medium: { copper: "w-[600px] h-[600px] md:w-[900px] md:h-[900px]", teal: "w-[400px] h-[400px] md:w-[600px] md:h-[600px]", burgundy: "w-[400px] h-[400px] md:w-[600px] md:h-[600px]", blur: "blur-[120px]" },
    small: { copper: "w-[300px] h-[300px] md:w-[500px] md:h-[500px]", teal: "w-[200px] h-[200px] md:w-[350px] md:h-[350px]", burgundy: "w-[200px] h-[200px] md:w-[350px] md:h-[350px]", blur: "blur-[80px]" },
  };

  const s = sizes[size];
  const baseOpacity = 0.1 * intensity;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Copper */}
      <motion.div
        animate={{
          x: [0, 40, -25, 30, -15, 0],
          y: [0, -20, 15, -10, 20, 0],
          scale: [1, 1.08, 0.95, 1.05, 0.97, 1],
          opacity: [baseOpacity, baseOpacity * 1.4, baseOpacity * 0.8, baseOpacity * 1.2, baseOpacity * 0.9, baseOpacity],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 ${s.copper} bg-[#B88E64] ${s.blur}`}
        style={{ opacity: baseOpacity }}
      />

      {/* Teal */}
      <motion.div
        animate={{
          x: [0, -30, 25, -20, 10, 0],
          y: [0, 20, -15, 25, -10, 0],
          scale: [1, 1.1, 0.9, 1.06, 0.95, 1],
          opacity: [baseOpacity * 0.8, baseOpacity * 1.2, baseOpacity * 0.6, baseOpacity, baseOpacity * 0.7, baseOpacity * 0.8],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-[20%] left-[15%] -translate-x-1/4 -translate-y-1/4 ${s.teal} bg-[#3A6B6B] ${s.blur}`}
        style={{ opacity: baseOpacity * 0.8 }}
      />

      {/* Burgundy */}
      <motion.div
        animate={{
          x: [0, 25, -35, 15, -20, 0],
          y: [0, -15, 20, -20, 10, 0],
          scale: [1, 1.08, 0.92, 1.1, 0.88, 1],
          opacity: [baseOpacity * 0.8, baseOpacity * 1.1, baseOpacity * 0.6, baseOpacity, baseOpacity * 0.7, baseOpacity * 0.8],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-[15%] right-[10%] translate-x-1/4 translate-y-1/4 ${s.burgundy} bg-[#6B2A35] ${s.blur}`}
        style={{ opacity: baseOpacity * 0.8 }}
      />
    </div>
  );
}
