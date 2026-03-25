"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Blurred gradient orbs that parallax on scroll.
 * Uses z-[5] to sit above section content backgrounds.
 * All orbs are pointer-events-none so they don't block interaction.
 */
export function ScrollBackground() {
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y2 = useTransform(scrollYProgress, [0, 1], [100, -600]);
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -300]);
  const y4 = useTransform(scrollYProgress, [0, 1], [200, -500]);
  const y5 = useTransform(scrollYProgress, [0, 1], [-50, -350]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.3, 0.8]);
  const scale2 = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 0.8, 1.2]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {/* Large copper orb — right side */}
      <motion.div style={{ y: y1, scale: scale1 }}>
        <div className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-[#B88E64] opacity-[0.06] blur-[120px]" />
      </motion.div>

      {/* Warm espresso orb — left side */}
      <motion.div style={{ y: y2, scale: scale2 }}>
        <div className="absolute top-[60%] left-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#2A211A] opacity-[0.2] blur-[100px]" />
      </motion.div>

      {/* Bright copper — center-right */}
      <motion.div style={{ y: y4 }}>
        <div className="absolute top-[90%] right-[20%] w-[250px] h-[250px] md:w-[450px] md:h-[450px] bg-[#B88E64] opacity-[0.08] blur-[90px]" />
      </motion.div>

      {/* Deep warm — left */}
      <motion.div style={{ y: y3 }}>
        <div className="absolute top-[120%] left-[10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#1A1410] opacity-[0.25] blur-[110px]" />
      </motion.div>

      {/* Small bright copper — far down */}
      <motion.div style={{ y: y5, scale: scale1 }}>
        <div className="absolute top-[160%] right-[5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-[#B88E64] opacity-[0.07] blur-[80px]" />
      </motion.div>

      {/* Deep contrast orb */}
      <motion.div style={{ y: y2 }}>
        <div className="absolute top-[200%] left-[30%] w-[350px] h-[350px] md:w-[550px] md:h-[550px] bg-[#2A211A] opacity-[0.15] blur-[100px]" />
      </motion.div>

      {/* Bottom copper glow */}
      <motion.div style={{ y: y4, scale: scale2 }}>
        <div className="absolute top-[250%] right-[15%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#B88E64] opacity-[0.05] blur-[120px]" />
      </motion.div>
    </div>
  );
}
