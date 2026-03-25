"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Blurred gradient orbs that parallax on scroll — like the hero orbs
 * but throughout the entire page. Creates a living, breathing background.
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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Large copper orb — right side, slow drift */}
      <motion.div
        style={{ y: y1, scale: scale1 }}
        className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-accent/[0.06] blur-[120px]"
      />

      {/* Warm espresso orb — left side, counter-drift */}
      <motion.div
        style={{ y: y2, scale: scale2 }}
        className="absolute top-[60%] left-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#2A211A]/30 blur-[100px]"
      />

      {/* Bright copper accent — center-right, fastest parallax */}
      <motion.div
        style={{ y: y4 }}
        className="absolute top-[90%] right-[20%] w-[250px] h-[250px] md:w-[450px] md:h-[450px] bg-accent/[0.08] blur-[90px]"
      />

      {/* Deep warm tone — left, medium speed */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[120%] left-[10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#1A1410]/40 blur-[110px]"
      />

      {/* Small bright copper — far down the page */}
      <motion.div
        style={{ y: y5, scale: scale1 }}
        className="absolute top-[160%] right-[5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-accent/[0.07] blur-[80px]"
      />

      {/* Very deep orb — darkest, adds contrast */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[200%] left-[30%] w-[350px] h-[350px] md:w-[550px] md:h-[550px] bg-[#2A211A]/25 blur-[100px]"
      />

      {/* Bottom copper glow */}
      <motion.div
        style={{ y: y4, scale: scale2 }}
        className="absolute top-[250%] right-[15%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-accent/[0.05] blur-[120px]"
      />
    </div>
  );
}
