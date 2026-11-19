"use client";

import { useEffect, useRef, useState } from "react";
import { formatAccountNumber, wedding } from "@/lib/wedding";
import Reveal from "./Reveal";
import Tilt from "./Tilt";

type Props = {
  notify: (message: string) => void;
};

function Chip() {
  return (
    <svg
      className="h-7 w-9 text-gold-light/80"
      viewBox="0 0 36 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="34" height="24" rx="4" />
      <line x1="12" y1="1" x2="12" y2="25" />
      <line x1="24" y1="1" x2="24" y2="25" />
      <line x1="1" y1="9" x2="12" y2="9" />
      <line x1="24" y1="17" x2="35" y2="17" />
    </svg>
  );
}

export default function Gift({ notify }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const copy = async (value: string, id: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }

    setCopied(id);
    notify(message);
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(""), 2200);
  };

  const address = `${wedding.giftAddress.name} - ${wedding.giftAddress.detail}`;

  return (
    <section
      id="hadiah"
      className="border-y border-gold-champagne/20 bg-ivory-warm/90 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-dark">
            Wedding Gift
          </span>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-sage-deep sm:text-5xl">
            Amplop Digital
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-sage-soft sm:text-sm">
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
            Namun jika memberi adalah ungkapan tanda kasih Anda, Anda dapat
            memberi kado secara cashless melalui tautan di bawah ini:
          </p>

          <button
            id="toggle-gift-btn"
            type="button"
            aria-expanded={open}
            aria-controls="gift-cards-container"
            onClick={() => setOpen((value) => !value)}
            className="mt-6 inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-sage-deep to-sage-darker px-7 py-3.5 text-xs font-semibold text-ivory-base shadow-luxury transition-all duration-300 hover:brightness-110 sm:text-sm"
          >
            <svg
              className="h-4 w-4 text-gold-light"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="20 12 20 22 4 22 4 12" />
              <rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
            </svg>
            <span>{open ? "Tutup Amplop Digital" : "Kirim Hadiah"}</span>
            <svg
              className={`h-4 w-4 text-gold-light transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </Reveal>

        {open && (
          <div id="gift-cards-container" className="mt-8 text-left">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {wedding.banks.map((bank) => {
                const id = `bank-${bank.bank}`;
                return (
                  <Tilt
                    key={bank.bank}
                    max={5}
                    className={`overflow-hidden rounded-3xl border border-gold-champagne/40 bg-gradient-to-br p-6 text-ivory-base shadow-xl sm:p-7 ${bank.color}`}
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-lg font-bold tracking-wider text-white">
                        {bank.bank}
                      </span>
                      <Chip />
                    </div>
                    <p className="text-[11px] uppercase tracking-widest text-ivory-warm/70">
                      Nomor Rekening
                    </p>
                    <p className="mt-1 font-mono text-xl font-semibold tracking-wider text-gold-light sm:text-2xl">
                      {formatAccountNumber(bank.number)}
                    </p>
                    <p className="mt-2 text-xs text-ivory-base/90 sm:text-sm">
                      a.n. <span className="font-semibold">{bank.holder}</span>
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        copy(
                          bank.number,
                          id,
                          `Nomor rekening ${bank.bank} berhasil disalin!`,
                        )
                      }
                      className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-ivory-base/20 bg-ivory-base/15 px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-gold-champagne hover:text-sage-darker"
                    >
                      {copied === id ? (
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                      )}
                      <span>
                        {copied === id ? "Tersalin" : "Salin Rekening"}
                      </span>
                    </button>
                  </Tilt>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col justify-between gap-4 rounded-3xl border border-gold-champagne/35 bg-ivory-card p-6 shadow-luxury sm:flex-row sm:items-center">
              <div>
                <div className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-dark">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <span>Kirim Kado Fisik</span>
                </div>
                <p className="text-sm font-semibold text-sage-deep">
                  Penerima: {wedding.giftAddress.name}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-sage-soft">
                  {wedding.giftAddress.detail}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  copy(
                    address,
                    "address",
                    "Alamat pengiriman kado berhasil disalin!",
                  )
                }
                className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-sage-soft/30 bg-ivory-warm px-4 py-2.5 text-xs font-semibold text-sage-deep transition-colors duration-300 hover:bg-sage-deep hover:text-ivory-base"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                <span>{copied === "address" ? "Tersalin" : "Salin Alamat"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
