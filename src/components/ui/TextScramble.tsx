"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Text scramble effect — characters scramble briefly then settle.
 * Used on hero text for a cinematic reveal.
 */
export function TextScramble({
  text,
  className = "",
  delay = 0,
  speed = 20,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  const [display, setDisplay] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const timer = setTimeout(() => {
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              if (i < iteration) return text[i];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );
        iteration += 1;
        if (iteration > text.length) {
          setDisplay(text);
          clearInterval(interval);
        }
      }, speed);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, speed]);

  return <span className={className}>{display || "\u00A0"}</span>;
}
