"use client";

import { useEffect, useState } from "react";

const NAV = [
  {
    id: "mempelai",
    label: "Mempelai",
    icon: (
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    ),
  },
  {
    id: "acara",
    label: "Acara",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
  },
  {
    id: "galeri",
    label: "Galeri",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </>
    ),
  },
  {
    id: "hadiah",
    label: "Hadiah",
    icon: (
      <>
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
      </>
    ),
  },
  {
    id: "ucapan",
    label: "Ucapan",
    icon: (
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    ),
  },
];

type Props = {
  playing: boolean;
  onToggleMusic: () => void;
  toast: { message: string; id: number } | null;
};

export default function Chrome({ playing, onToggleMusic, toast }: Props) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = NAV.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.15, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <button
        id="music-toggle-btn"
        type="button"
        aria-label={playing ? "Jeda musik latar" : "Putar musik latar"}
        aria-pressed={playing}
        title="Musik Latar"
        onClick={onToggleMusic}
        className="fixed bottom-20 right-4 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gold-champagne/60 bg-sage-darker/90 text-gold-light shadow-nav backdrop-blur-md transition-transform duration-300 hover:scale-105 sm:right-6"
      >
        <span
          id="music-disc-icon"
          className={`flex items-center justify-center ${
            playing ? "animate-spin-slow" : "animate-spin-slow animation-paused"
          }`}
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <nav
        aria-label="Navigasi Undangan"
        className="fixed bottom-4 left-1/2 z-40 w-[92%] max-w-md -translate-x-1/2 rounded-full border border-gold-champagne/35 bg-sage-darker/85 px-2 py-1.5 shadow-nav backdrop-blur-lg"
      >
        <ul className="grid grid-cols-5 items-center text-center">
          {NAV.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  data-nav={item.id}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex flex-col items-center justify-center rounded-full px-1 py-1.5 transition-colors ${
                    isActive
                      ? "bg-gold-champagne/15 text-gold-light"
                      : "text-ivory-warm/75 hover:text-gold-light"
                  }`}
                >
                  <svg
                    className="mb-0.5 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </svg>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        id="toast-notification"
        role="status"
        aria-live="polite"
        aria-hidden={toast ? undefined : true}
        className={`pointer-events-none fixed left-1/2 top-5 z-[60] -translate-x-1/2 transition-all duration-300 ${
          toast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-gold-champagne/60 bg-sage-darker px-5 py-3 text-xs font-medium text-ivory-base shadow-2xl sm:text-sm">
          <svg
            className="h-4 w-4 shrink-0 text-gold-light"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span id="toast-message">{toast?.message ?? ""}</span>
        </div>
      </div>
    </>
  );
}
