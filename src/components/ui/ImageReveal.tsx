"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Image reveal effect — bronze overlay wipes away to reveal content.
 */
export function ImageReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        initial={{ x: "0%" }}
        animate={inView ? { x: "100%" } : { x: "0%" }}
        transition={{
          duration: 0.8,
          delay: delay + 0.2,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="absolute inset-0 bg-accent z-10"
      />
    </div>
  );
}
