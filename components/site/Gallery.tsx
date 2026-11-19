"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Reveal from "./Reveal";

const PHOTOS = [
  {
    src: "/images/adat/adat-couple-umbrella.jpg",
    alt: "Mirza dan Ira berfoto bersama dengan payung dalam balutan busana adat",
    caption: "Balutan Busana Adat",
    position: "object-top",
  },
  {
    src: "/images/adat/adat-couple-stand.jpg",
    alt: "Mirza dan Ira berdiri berpegangan tangan dengan busana adat",
    caption: "Tangan yang Bergenggam",
    position: "object-top",
  },
  {
    src: "/images/adat/adat-groom.jpg",
    alt: "Muhammad Mirza Fahlefi dalam balutan busana adat pria",
    caption: "Sang Mempelai Pria",
    position: "object-top",
  },
  {
    src: "/images/adat/adat-bride.jpg",
    alt: "Ira Rahmawati dalam balutan busana adat wanita",
    caption: "Sang Mempelai Wanita",
    position: "object-top",
  },
];

export default function Gallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const touchStart = useRef(0);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };

  const close = () => dialogRef.current?.close();

  const next = () => setIndex((i) => (i + 1) % PHOTOS.length);
  const prev = () => setIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);

  const photo = PHOTOS[index];

  return (
    <section id="galeri" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal className="mx-auto mb-12 max-w-xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-dark">
            Our Moments
          </span>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-sage-deep sm:text-5xl">
            Galeri Momen Bahagia
          </h2>
          <p className="mt-2 text-xs text-sage-soft sm:text-sm">
            Ketuk foto untuk memperbesar tampilan kenangan indah kami.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
          {PHOTOS.map((item, i) => (
            <Reveal key={item.caption} delay={i * 70}>
              <button
                type="button"
                onClick={() => open(i)}
                className="group relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-2xl border border-gold-champagne/25 shadow-luxury focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-champagne sm:rounded-3xl"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 384px"
                  className={`object-cover ${item.position} transition-transform duration-700 group-hover:scale-105`}
                />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-sage-darker/75 via-transparent to-transparent p-4 text-left opacity-80 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                  <span>
                    <span className="block font-serif text-base font-medium text-white sm:text-lg">
                      {item.caption}
                    </span>
                    <span className="block text-[11px] text-gold-light">
                      Mirza &amp; Ira
                    </span>
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Galeri foto Mirza dan Ira"
        {...({ closedby: "any" } as Record<string, string>)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            next();
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            prev();
          }
        }}
      >
        <div
          className="flex h-full w-full flex-col justify-between p-4 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between text-ivory-base">
            <span className="text-xs font-medium tracking-widest text-gold-light sm:text-sm">
              {index + 1} / {PHOTOS.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Tutup galeri"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-ivory-base/10 text-white transition hover:bg-ivory-base/20"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div
            className="relative mx-auto my-4 flex w-full max-w-4xl flex-1 select-none items-center justify-center"
            onTouchStart={(e) => {
              touchStart.current = e.changedTouches[0].screenX;
            }}
            onTouchEnd={(e) => {
              const delta = touchStart.current - e.changedTouches[0].screenX;
              if (Math.abs(delta) > 45) {
                if (delta > 0) next();
                else prev();
              }
            }}
          >
            <button
              type="button"
              onClick={prev}
              aria-label="Foto sebelumnya"
              className="absolute left-1 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ivory-base/20 bg-sage-darker/80 text-white transition hover:bg-gold-champagne hover:text-sage-darker sm:left-4 sm:h-12 sm:w-12"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={1200}
              height={1600}
              sizes="(max-width: 1024px) 100vw, 896px"
              className="photo-in max-h-[72vh] w-auto max-w-full rounded-2xl border border-gold-champagne/30 object-contain shadow-2xl"
            />

            <button
              type="button"
              onClick={next}
              aria-label="Foto berikutnya"
              className="absolute right-1 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ivory-base/20 bg-sage-darker/80 text-white transition hover:bg-gold-champagne hover:text-sage-darker sm:right-4 sm:h-12 sm:w-12"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="mx-auto max-w-xl text-center">
            <p className="font-serif text-lg text-white sm:text-xl">
              {photo.caption}
            </p>
            <p className="mt-0.5 text-xs text-ivory-warm/70">
              Muhammad Mirza Fahlefi &amp; Ira Rahmawati
            </p>
          </div>
        </div>
      </dialog>
    </section>
  );
}
