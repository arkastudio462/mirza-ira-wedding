"use client";

import Image from "next/image";
import { wedding } from "@/lib/wedding";

type Props = {
  guest: string;
  opened: boolean;
  gone: boolean;
  onOpen: () => void;
};

export default function Cover({ guest, opened, gone, onOpen }: Props) {
  return (
    <section
      id="opening-cover"
      aria-hidden={opened || undefined}
      inert={opened || undefined}
      className={`cover-curtain fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-sage-darker px-6 py-10 text-center sm:py-14 ${
        opened ? "opened" : ""
      }`}
      style={gone ? { display: "none" } : undefined}
    >
      <Image
        src="/images/adat/adat-cover.jpg"
        alt="Muhammad Mirza Fahlefi dan Ira Rahmawati dalam balutan busana adat"
        fill
        priority
        sizes="100vw"
        className="scale-105 object-cover object-top"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-sage-darker/60 via-sage-deep/55 to-sage-darker/95" />
      <div className="pointer-events-none absolute inset-4 rounded-b-3xl rounded-t-full border border-gold-champagne/35 sm:inset-8" />

      <div className="relative z-10 mt-4 flex flex-col items-center sm:mt-6">
        <svg
          className="mb-3 h-12 w-12 text-gold-light opacity-90"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          aria-hidden="true"
        >
          <path d="M32 54C32 38 22 26 10 22C14 34 22 44 32 54Z" />
          <path d="M32 54C32 38 42 26 54 22C50 34 42 44 32 54Z" />
          <path d="M32 48V12" strokeLinecap="round" />
          <circle cx="32" cy="10" r="2.5" fill="currentColor" />
          <path d="M32 32C26 24 20 18 16 14" strokeLinecap="round" />
          <path d="M32 32C38 24 44 18 48 14" strokeLinecap="round" />
        </svg>

        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-ivory-warm/90 sm:text-xs">
          The Wedding of
        </p>
        <h1 className="mt-2 font-script text-5xl leading-tight text-gold-light drop-shadow-md sm:text-7xl">
          {wedding.monogram.groom} &amp; {wedding.monogram.bride}
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="h-px w-8 bg-gold-champagne/60" />
          <span className="font-serif text-base italic tracking-wider text-ivory-base/95 sm:text-lg">
            {wedding.dateLabel}
          </span>
          <span className="h-px w-8 bg-gold-champagne/60" />
        </div>
      </div>

      <div className="relative z-10 mx-auto mb-2 w-full max-w-sm sm:mb-4">
        <div className="rounded-3xl border border-ivory-base/20 bg-ivory-base/10 px-6 py-6 shadow-2xl backdrop-blur-md">
          <p className="mb-1.5 text-xs uppercase tracking-[0.2em] text-ivory-warm/80">
            Kepada Yth.
          </p>
          <p
            id="guest-name-display"
            className="break-words font-serif text-2xl font-semibold tracking-wide text-white sm:text-3xl"
          >
            {guest}
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ivory-warm/75">
            Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di
            hari bahagia kami.
          </p>

          <button
            id="open-invitation-btn"
            type="button"
            onClick={onOpen}
            className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-gold-champagne via-gold-light to-gold-champagne px-6 py-3.5 text-sm font-semibold text-sage-darker shadow-gold-glow transition-all duration-300 hover:brightness-105 active:scale-[0.98]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 19V9a2 2 0 01.89-1.66l7-4.67a2 2 0 012.22 0l7 4.67A2 2 0 0121 9v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9l9 6 9-6"
              />
            </svg>
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>
    </section>
  );
}
