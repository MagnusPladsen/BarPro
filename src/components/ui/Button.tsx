"use client";

import { Link } from "@/i18n/navigation";
import { type Pathnames } from "@/i18n/routing";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "outline";
type ButtonSize = "default" | "large";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: Pathnames;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  children,
  variant = "primary",
  size = "default",
  href,
  className = "",
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const baseStyles = [
    "relative inline-flex items-center justify-center gap-2",
    "font-body font-medium tracking-[0.15em] uppercase text-xs",
    "transition-all duration-500 cursor-pointer",
    "overflow-hidden group",
    size === "large" ? "px-12 py-5" : "px-8 py-4",
    variant === "primary"
      ? "bg-gold text-background hover:bg-gold-hover"
      : "bg-transparent border border-gold/40 text-gold hover:border-gold hover:bg-gold/5",
    className,
  ].join(" ");

  if (href) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring" as const, stiffness: 400, damping: 20 }}
        className="inline-block"
      >
        <Link href={href} className={baseStyles}>
          <span className="relative z-10">{children}</span>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 20 }}
      className={baseStyles}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
