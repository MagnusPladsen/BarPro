"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Sticky background: copper gradient blur + luxury geometric pattern
 * that rotates on scroll.
 */
export function ScrollBackground() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.08, 1]);
  const patternOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.06, 0.12, 0.09, 0.05]);
  const orbX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">

      {/* Copper gradient blur — always visible, shifts on scroll */}
      <motion.div
        style={{ x: orbX, y: orbY }}
        className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[#B88E64] opacity-[0.04] blur-[200px]"
      />

      {/* Second warm orb — bottom */}
      <motion.div
        style={{ x: orbX }}
        className="absolute top-[70%] right-[-10%] w-[80vw] h-[80vh] bg-[#2A211A] opacity-[0.06] blur-[150px]"
      />

      {/* Rotating geometric pattern */}
      <motion.div
        style={{ rotate, scale, opacity: patternOpacity }}
        className="absolute inset-[-50%] flex items-center justify-center"
      >
        <svg
          viewBox="0 0 800 800"
          className="w-[200vw] h-[200vh] text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          {/* Concentric diamonds */}
          {[100, 160, 220, 280, 340, 400].map((size, i) => (
            <rect
              key={`d-${i}`}
              x={400 - size / 2}
              y={400 - size / 2}
              width={size}
              height={size}
              transform="rotate(45 400 400)"
              opacity={0.5 + i * 0.08}
            />
          ))}

          {/* Crossing lines */}
          <line x1="0" y1="400" x2="800" y2="400" opacity="0.3" />
          <line x1="400" y1="0" x2="400" y2="800" opacity="0.3" />
          <line x1="0" y1="0" x2="800" y2="800" opacity="0.2" />
          <line x1="800" y1="0" x2="0" y2="800" opacity="0.2" />

          {/* Corner accents */}
          {[
            "M 100 100 L 160 100 L 100 160",
            "M 700 100 L 640 100 L 700 160",
            "M 100 700 L 160 700 L 100 640",
            "M 700 700 L 640 700 L 700 640",
          ].map((d, i) => (
            <path key={`c-${i}`} d={d} opacity="0.4" strokeWidth="0.6" />
          ))}

          {/* Inner circles */}
          <circle cx="400" cy="400" r="80" opacity="0.35" />
          <circle cx="400" cy="400" r="120" opacity="0.2" strokeDasharray="4 8" />
          <circle cx="400" cy="400" r="40" opacity="0.25" strokeWidth="0.3" />

          {/* Radial dots */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const r = 200;
            return (
              <circle
                key={`dot-${i}`}
                cx={400 + Math.cos(angle) * r}
                cy={400 + Math.sin(angle) * r}
                r="2.5"
                fill="currentColor"
                opacity="0.3"
              />
            );
          })}

          {/* Outer corner squares */}
          {[
            { x: 50, y: 50 }, { x: 720, y: 50 },
            { x: 50, y: 720 }, { x: 720, y: 720 },
          ].map((pos, i) => (
            <rect key={`sq-${i}`} x={pos.x} y={pos.y} width="30" height="30" opacity="0.15" strokeWidth="0.4" />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
