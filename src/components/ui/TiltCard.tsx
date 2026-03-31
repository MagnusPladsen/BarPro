"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

/**
 * 3D perspective tilt card — tilts toward cursor on hover.
 * Desktop only, no effect on touch devices.
 */
export function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    ref.current.style.transition = "transform 0.1s ease, box-shadow 0.4s ease";
  }

  function handleMouseLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(800px) rotateY(0) rotateX(0) scale(1)";
    ref.current.style.transition = "transform 0.5s ease, box-shadow 0.4s ease";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
