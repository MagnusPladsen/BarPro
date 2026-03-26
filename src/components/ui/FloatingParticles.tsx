"use client";

/**
 * Subtle floating particles that drift upward in the background.
 * Pure CSS animation — no JS overhead.
 */
export function FloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${8 + (i * 7.5) % 84}%`,
    size: 1.5 + (i % 3) * 0.5,
    delay: i * 2.5,
    duration: 18 + (i % 4) * 6,
    opacity: 0.15 + (i % 3) * 0.08,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: `rgba(201, 168, 76, ${p.opacity})`,
            animation: `float-up ${p.duration}s ease-in-out ${p.delay}s infinite, sway ${8 + p.id % 4}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
