"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Sticky background with a subtle luxury geometric pattern
 * that slowly rotates as user scrolls. Think high-end hotel wallpaper.
 */
export function ScrollBackground() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.08, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.03, 0.045, 0.04, 0.02]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      <motion.div
        style={{ rotate, scale, opacity }}
        className="absolute inset-[-50%] flex items-center justify-center"
      >
        <svg
          viewBox="0 0 800 800"
          className="w-[200vw] h-[200vh] text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
        >
          {/* Concentric diamonds */}
          {[100, 160, 220, 280, 340, 400].map((size, i) => (
            <rect
              key={`d-${i}`}
              x={400 - size / 2}
              y={400 - size / 2}
              width={size}
              height={size}
              transform={`rotate(45 400 400)`}
              opacity={0.4 + i * 0.1}
            />
          ))}

          {/* Crossing lines */}
          <line x1="0" y1="400" x2="800" y2="400" opacity="0.2" />
          <line x1="400" y1="0" x2="400" y2="800" opacity="0.2" />
          <line x1="0" y1="0" x2="800" y2="800" opacity="0.15" />
          <line x1="800" y1="0" x2="0" y2="800" opacity="0.15" />

          {/* Corner accents */}
          {[
            "M 100 100 L 150 100 L 100 150",
            "M 700 100 L 650 100 L 700 150",
            "M 100 700 L 150 700 L 100 650",
            "M 700 700 L 650 700 L 700 650",
          ].map((d, i) => (
            <path key={`c-${i}`} d={d} opacity="0.3" />
          ))}

          {/* Inner circle */}
          <circle cx="400" cy="400" r="80" opacity="0.25" />
          <circle cx="400" cy="400" r="120" opacity="0.15" strokeDasharray="4 8" />

          {/* Radial dots */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const r = 200;
            return (
              <circle
                key={`dot-${i}`}
                cx={400 + Math.cos(angle) * r}
                cy={400 + Math.sin(angle) * r}
                r="2"
                fill="currentColor"
                opacity="0.2"
              />
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}
