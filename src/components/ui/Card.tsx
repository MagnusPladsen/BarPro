"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({
  children,
  className = "",
  hover = true,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-background-card border border-border overflow-hidden ${
        hover
          ? "hover:border-border-gold hover:shadow-[0_0_50px_rgba(201,168,76,0.08)] transition-all duration-500"
          : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
