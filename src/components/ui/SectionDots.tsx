"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * Apple-style section navigation dots — homepage only.
 * Shows which section is in view, click to jump.
 */
export function SectionDots() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const [sectionCount, setSectionCount] = useState(0);
  const sectionsRef = useRef<Element[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const isHomepage = pathname === "/" || pathname === "/en";

  const scrollTo = useCallback((i: number) => {
    sectionsRef.current[i]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!isHomepage) {
      setSectionCount(0);
      sectionsRef.current = [];
      return;
    }

    function setup() {
      // Clean up previous observer
      observerRef.current?.disconnect();

      // Find all sections anywhere inside main
      const found = Array.from(document.querySelectorAll("section"));
      // Filter to only top-level page sections (not nested ones inside cards etc)
      const pageSections = found.filter(
        (s) => s.closest("main") && !s.closest("section section")
      );

      sectionsRef.current = pageSections;
      setSectionCount(pageSections.length);
      setActiveIndex(0);

      if (pageSections.length < 2) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = sectionsRef.current.indexOf(entry.target);
              if (idx >= 0) setActiveIndex(idx);
            }
          });
        },
        { threshold: 0.2 }
      );

      pageSections.forEach((s) => observer.observe(s));
      observerRef.current = observer;
    }

    // Wait for page transition to finish rendering
    const timeout = setTimeout(setup, 300);
    return () => {
      clearTimeout(timeout);
      observerRef.current?.disconnect();
    };
  }, [isHomepage, pathname]);

  if (!isHomepage || sectionCount < 2) return null;

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
      {Array.from({ length: sectionCount }, (_, i) => (
        <button
          key={i}
          onClick={() => scrollTo(i)}
          className={`w-2 h-2 border transition-all duration-300 cursor-pointer ${
            i === activeIndex
              ? "bg-accent border-accent shadow-[0_0_12px_rgba(160,120,74,0.4)]"
              : "bg-transparent border-accent/30 hover:border-accent"
          }`}
          aria-label={`Go to section ${i + 1}`}
        />
      ))}
    </div>
  );
}
