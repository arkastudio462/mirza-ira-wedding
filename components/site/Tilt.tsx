"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Kemiringan maksimum dalam derajat (default 6). */
  max?: number;
  glare?: boolean;
};

/**
 * Kartu dengan kemiringan 3D mengikuti kursor. Hanya aktif untuk pointer
 * mouse dan pengguna yang tidak meminta pengurangan gerak.
 */
export default function Tilt({
  children,
  className = "",
  max = 6,
  glare = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    el.style.setProperty("--tilt-y", `${(x - 0.5) * max * 2}deg`);
    el.style.setProperty("--tilt-x", `${(0.5 - y) * max * 2}deg`);
    el.style.setProperty("--glare-x", `${x * 100}%`);
    el.style.setProperty("--glare-y", `${y * 100}%`);
    el.style.setProperty("--glare-o", glare ? "0.45" : "0");
    el.classList.add("is-tilting");
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--glare-o", "0");
    el.classList.remove("is-tilting");
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={`tilt-card ${className}`}
    >
      {children}
      {glare && <span aria-hidden="true" className="tilt-glare" />}
    </div>
  );
}
