"use client";

import { motion } from "framer-motion";
import { CinematicReveal } from "@/components/ui/CinematicReveal";

interface SectionHeadingProps {
  label?: string;
  heading: string;
  centered?: boolean;
}

export function SectionHeading({
  label,
  heading,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "text-center mx-auto max-w-3xl" : ""}>
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-accent uppercase tracking-[0.25em] text-[11px] font-body font-medium mb-6"
        >
          {label}
        </motion.p>
      )}
      <CinematicReveal className="font-display italic text-4xl md:text-5xl lg:text-6xl text-text-primary font-light leading-[1.1]">
        {heading}
      </CinematicReveal>
    </div>
  );
}
