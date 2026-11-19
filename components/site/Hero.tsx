"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/wedding";
import Reveal from "./Reveal";

type Left = { hari: number; jam: number; menit: number; detik: number };

function diff(target: number): Left {
  const left = Math.max(0, target - Date.now());
  return {
    hari: Math.floor(left / 86_400_000),
    jam: Math.floor((left / 3_600_000) % 24),
    menit: Math.floor((left / 60_000) % 60),
    detik: Math.floor((left / 1_000) % 60),
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toGoogleDate(iso: string) {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export default function Hero() {
  const target = useRef(new Date(wedding.dateISO).getTime()).current;
  const [left, setLeft] = useState<Left | null>(null);

  useEffect(() => {
    setLeft(diff(target));
    const timer = window.setInterval(() => setLeft(diff(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const calendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(
      `Pernikahan ${wedding.groom.fullName} & ${wedding.bride.fullName}`,
    )}` +
    `&dates=${toGoogleDate(wedding.akad.start)}/${toGoogleDate(wedding.resepsi.end)}` +
    `&details=${encodeURIComponent(
      `Undangan Pernikahan ${wedding.groom.fullName} & ${wedding.bride.fullName}`,
    )}` +
    `&location=${encodeURIComponent(
      `${wedding.akad.venue} & ${wedding.resepsi.venue}, Jakarta`,
    )}`;

  const units = [
    { value: left?.hari ?? 0, label: "Hari", gold: false },
    { value: left?.jam ?? 0, label: "Jam", gold: false },
    { value: left?.menit ?? 0, label: "Menit", gold: false },
    { value: left?.detik ?? 0, label: "Detik", gold: true },
  ];

  return (
    <header
      id="hero"
      className="relative isolate overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16"
    >
      <Image
        src="/images/adat/adat-couple-umbrella.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        fetchPriority="low"
        className="hero-parallax-bg pointer-events-none -z-10 object-cover object-top opacity-45 blur-[1px]"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ivory-base/45 via-ivory-base/75 to-ivory-base" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-sage-mist/25 via-transparent to-blush-sunset/25" />

      <svg
        className="pointer-events-none absolute -left-8 -top-6 h-44 w-44 animate-float text-sage-soft/15"
        viewBox="0 0 200 200"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20,180 C40,110 90,60 170,30 C130,90 95,140 20,180 Z" />
        <path
          d="M10,140 C25,85 65,45 125,20 C95,65 65,105 10,140 Z"
          opacity="0.6"
        />
      </svg>
      <svg
        className="pointer-events-none absolute -right-8 -top-6 h-44 w-44 animate-float text-gold-champagne/15"
        style={{ animationDelay: "2s" }}
        viewBox="0 0 200 200"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M180,180 C160,110 110,60 30,30 C70,90 105,140 180,180 Z" />
        <path
          d="M190,140 C175,85 135,45 75,20 C105,65 135,105 190,140 Z"
          opacity="0.6"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-3xl text-center">

        <Reveal className="relative mx-auto mb-8 max-w-xs sm:max-w-sm">
          <div className="absolute -inset-2.5 rounded-[9999px_9999px_1.25rem_1.25rem] border border-gold-champagne/55" />
          <div className="arch-frame relative aspect-[3/4] overflow-hidden bg-sage-mist shadow-luxury">
            <Image
              src="/images/adat/adat-couple-stand.jpg"
              alt="Muhammad Mirza Fahlefi dan Ira Rahmawati dalam balutan busana adat"
              fill
              sizes="(max-width: 640px) 80vw, 384px"
              className="parallax-photo object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sage-darker/35 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold-champagne/40 bg-ivory-card px-5 py-2 shadow-md">
            <span className="font-serif text-base font-semibold italic text-sage-deep sm:text-lg">
              {wedding.dateShort}
            </span>
          </div>
        </Reveal>

        <Reveal className="mt-10">
          <h2 className="font-script text-5xl leading-tight text-sage-deep sm:text-7xl">
            {wedding.monogram.groom} &amp; {wedding.monogram.bride}
          </h2>
          <p className="mt-1 font-serif text-xl font-medium tracking-wide text-sage-soft sm:text-2xl">
            {wedding.groom.fullName} &amp; {wedding.bride.fullName}
          </p>
          <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-sage-soft/90 sm:pr-0 sm:text-sm">
            Kami memohon doa restu serta kehadiran Bapak/Ibu/Saudara/i untuk
            menjadi saksi ikrar suci pernikahan kami pada:
          </p>
          <p className="mt-2 font-serif text-lg font-semibold text-gold-dark sm:text-xl">
            {wedding.dateLabel}
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-8 max-w-md">
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
            {units.map((unit) => (
              <div
                key={unit.label}
                className="rounded-2xl border border-gold-champagne/30 bg-ivory-card/90 px-2 py-3.5 shadow-luxury backdrop-blur-sm"
              >
                <span
                  key={unit.value}
                  className={`digit-flip block font-serif text-2xl font-bold sm:text-4xl ${
                    unit.gold ? "text-gold-champagne" : "text-sage-deep"
                  }`}
                >
                  {pad(unit.value)}
                </span>
                <span className="mt-1 block text-[11px] uppercase tracking-widest text-sage-soft">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <a
              id="google-calendar-btn"
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sage-deep px-6 py-3 text-xs font-medium text-ivory-base shadow-md transition-all duration-300 hover:bg-sage-darker sm:text-sm"
            >
              <svg
                className="h-4 w-4 text-gold-light"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Simpan ke Kalender</span>
            </a>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
