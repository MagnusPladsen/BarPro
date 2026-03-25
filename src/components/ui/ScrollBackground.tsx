"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * 3 color orbs (copper, teal, burgundy) matching the hero — smaller,
 * drift left-to-right on scroll, always gently animated.
 */
export function ScrollBackground() {
  const { scrollYProgress } = useScroll();

  const x1 = useTransform(scrollYProgress, [0, 1], ["-15vw", "25vw"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["10vw", "-20vw"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["-10vw", "30vw"]);

  return (
    <div
      className="absolute top-0 left-0 w-full pointer-events-none overflow-hidden"
      style={{ height: "500vh", zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Copper — drifts right */}
      <motion.div style={{ x: x1 }} className="absolute top-[25%] left-[50%]">
        <motion.div
          animate={{
            scale: [1, 1.2, 0.9, 1.15, 1],
            opacity: [0.07, 0.12, 0.06, 0.1, 0.07],
            y: [0, -30, 20, -15, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#B88E64] blur-[100px]"
          style={{ opacity: 0.07 }}
        />
      </motion.div>

      {/* Teal — drifts left (counter) */}
      <motion.div style={{ x: x2 }} className="absolute top-[50%] left-[20%]">
        <motion.div
          animate={{
            scale: [1, 0.85, 1.15, 0.95, 1],
            opacity: [0.06, 0.1, 0.05, 0.09, 0.06],
            y: [0, 25, -20, 10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-[#3A6B6B] blur-[90px]"
          style={{ opacity: 0.06 }}
        />
      </motion.div>

      {/* Burgundy — drifts right */}
      <motion.div style={{ x: x3 }} className="absolute top-[75%] left-[65%]">
        <motion.div
          animate={{
            scale: [1, 1.1, 0.9, 1.2, 1],
            opacity: [0.06, 0.1, 0.05, 0.08, 0.06],
            y: [0, -20, 15, -10, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-[#6B2A35] blur-[85px]"
          style={{ opacity: 0.06 }}
        />
      </motion.div>
    </div>
  );
}
