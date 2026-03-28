"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Luxury loading screen shown on first visit.
 * BarPro logo with bronze shimmer, then content reveals.
 * Session-based — only shows once per browser session.
 */
export function LoadingScreen() {
  const [show, setShow] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("barpro-loaded")) return;
    setShow(true);
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setExit(true);
      document.body.style.overflow = "";
      sessionStorage.setItem("barpro-loaded", "1");
    }, 2400);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "#0D0A08" }}
        >
          {/* Ambient orb */}
          <div
            className="absolute w-[600px] h-[600px] blur-[200px] opacity-[0.08]"
            style={{ backgroundColor: "#A0784A" }}
          />

          <div className="relative flex flex-col items-center gap-6">
            {/* Logo text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
            >
              <span
                className="font-display text-6xl md:text-8xl font-light tracking-[0.15em] uppercase"
                style={{ color: "#A0784A" }}
              >
                BarPro
              </span>

              {/* Shimmer sweep */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 1.4, delay: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(160,120,74,0.3) 50%, transparent 100%)",
                  width: "50%",
                }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="font-body text-[11px] tracking-[0.3em] uppercase"
              style={{ color: "#6B5D52" }}
            >
              Din anledning. V&aring;r kvalitet.
            </motion.span>

            {/* Loading line */}
            <motion.div
              className="mt-4 h-[1px] w-32"
              style={{ backgroundColor: "rgba(160,120,74,0.2)" }}
            >
              <motion.div
                initial={{ scaleX: 0, transformOrigin: "left" }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2, delay: 0.4, ease: "easeInOut" }}
                className="h-full w-full"
                style={{ backgroundColor: "#A0784A" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
