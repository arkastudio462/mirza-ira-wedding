"use client";

import { useEffect, useMemo, useState } from "react";
import { wedding } from "@/lib/wedding";
import {
  getSupabase,
  isSupabaseReady,
  LOCAL_KEY,
  TABLE,
  type Attendance,
  type Wish,
} from "@/lib/supabase";
import Reveal from "./Reveal";

type Props = {
  guest: string;
  notify: (message: string) => void;
};

const ATTENDANCE: { value: Attendance; label: string; active: string }[] = [
  {
    value: "hadir",
    label: "Hadir",
    active: "peer-checked:bg-sage-deep peer-checked:text-ivory-base peer-checked:border-sage-deep",
  },
  {
    value: "ragu",
    label: "Masih Ragu",
    active: "peer-checked:bg-amber-700 peer-checked:text-white peer-checked:border-amber-700",
  },
  {
    value: "tidak",
    label: "Berhalangan",
    active: "peer-checked:bg-rose-800 peer-checked:text-white peer-checked:border-rose-800",
  },
];

function loadLocal(): Wish[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Buang ucapan contoh dari versi lama agar tidak tampil lagi.
    const wishes = (parsed as Wish[]).filter(
      (wish) =>
        wish && typeof wish.id === "string" && !wish.id.startsWith("contoh-"),
    );
    if (wishes.length !== parsed.length) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(wishes));
    }
    return wishes;
  } catch {
    return [];
  }
}

type WishInput = Omit<Wish, "id" | "created_at">;

function newLocalWish(input: WishInput): Wish {
  return {
    ...input,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `lokal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
  };
}

/** Ubah error Supabase menjadi petunjuk singkat yang bisa ditindaklanjuti. */
function explainSendError(error: unknown) {
  const err = (error ?? {}) as {
    code?: string;
    message?: string;
    details?: string;
  };
  const text =
    `${err.code ?? ""} ${err.message ?? ""} ${err.details ?? ""}`.toLowerCase();

  if (
    err.code === "PGRST205" ||
    text.includes("could not find the table") ||
    text.includes("does not exist")
  ) {
    return 'Tabel "ucapan" belum ada di database Supabase. Jalankan supabase/schema.sql di Supabase → SQL Editor.';
  }
  if (err.code === "42501" || text.includes("row-level security")) {
    return "Kebijakan keamanan (RLS) Supabase menolak penyimpanan. Jalankan ulang bagian policy pada supabase/schema.sql.";
  }
  if (text.includes("invalid api key") || text.includes("jwt") || err.code === "401") {
    return "Kunci Supabase tidak valid. Periksa NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di Vercel.";
  }
  if (
    text.includes("failed to fetch") ||
    text.includes("networkerror") ||
    text.includes("load failed")
  ) {
    return "Tidak bisa menghubungi Supabase. Periksa URL proyek dan koneksi server.";
  }
  return "Server ucapan belum bisa dihubungi.";
}

function timeAgo(iso: string) {
  const delta = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(delta)) return "";
  if (delta < 60_000) return "Baru saja";
  const minutes = Math.floor(delta / 60_000);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export default function Wishes({ guest, notify }: Props) {
  const supabase = useMemo(() => getSupabase(), []);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [nama, setNama] = useState("");
  const [hadir, setHadir] = useState<Attendance>("hadir");
  const [jumlah, setJumlah] = useState(2);
  const [pesan, setPesan] = useState("");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<{ nama?: string; pesan?: string }>({});

  useEffect(() => {
    let cancelled = false;

    const fallback = (message?: string) => {
      if (cancelled) return;
      setWishes(loadLocal());
      if (message) setNotice(message);
    };

    const run = async () => {
      if (!supabase) {
        fallback();
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from(TABLE)
        .select("id, nama, kehadiran, jumlah_tamu, pesan, created_at")
        .order("created_at", { ascending: false })
        .limit(120);

      if (cancelled) return;
      if (error) {
        fallback(
          "Buku ucapan belum terhubung ke server. Ucapan tersimpan di perangkat ini.",
        );
      } else {
        setWishes((data ?? []) as Wish[]);
      }
      setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  useEffect(() => {
    if (guest === wedding.guestFallback) return;
    setNama((value) => (value.trim().length > 0 ? value : guest));
  }, [guest]);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel("ucapan-undangan")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: TABLE },
        (payload) => {
          const incoming = payload.new as Wish;
          if (!incoming?.id) return;
          setWishes((prev) =>
            prev.some((item) => item.id === incoming.id)
              ? prev
              : [incoming, ...prev].slice(0, 120),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const saveLocal = (input: WishInput) => {
    const next = [newLocalWish(input), ...wishes].slice(0, 120);
    setWishes(next);
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    } catch {
      /* penyimpanan penuh atau diblokir */
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanName = nama.trim();
    const cleanMessage = pesan.trim();
    const nextErrors: { nama?: string; pesan?: string } = {};

    if (cleanName.length < 2)
      nextErrors.nama = "Mohon isi nama lengkap Anda.";
    if (cleanMessage.length < 2)
      nextErrors.pesan = "Mohon tuliskan ucapan dan doa Anda.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      notify("Mohon lengkapi nama dan ucapan Anda");
      return;
    }

    setSending(true);
    const payload = {
      nama: cleanName.slice(0, 60),
      kehadiran: hadir,
      jumlah_tamu: hadir === "tidak" ? 1 : jumlah,
      pesan: cleanMessage.slice(0, 600),
    };

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from(TABLE)
          .insert(payload)
          .select("id, nama, kehadiran, jumlah_tamu, pesan, created_at")
          .single();
        if (error) throw error;
        setWishes((prev) => [data as Wish, ...prev].slice(0, 120));
      } else {
        saveLocal(payload);
      }

      setNotice("");
      setPesan("");
      setJumlah(2);
      notify("Terima kasih! Ucapan & konfirmasi Anda telah terkirim.");
    } catch (error) {
      // Jangan sampai ucapan tamu hilang: simpan di perangkat ini sambil
      // memberi tahu penyebab server gagal.
      console.error("[ucapan] gagal menyimpan ke Supabase:", error);
      saveLocal(payload);
      setNotice(
        `${explainSendError(error)} Sementara itu, ucapan Anda tersimpan di perangkat ini.`,
      );
      setPesan("");
      setJumlah(2);
      notify("Ucapan tersimpan di perangkat ini");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="ucapan" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mx-auto mb-10 max-w-xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-dark">
            RSVP &amp; Wishes
          </span>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-sage-deep sm:text-5xl">
            Konfirmasi Kehadiran &amp; Doa Restu
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-sage-soft sm:text-sm">
            Kirimkan konfirmasi kehadiran serta untaian doa terbaik untuk
            perjalanan baru kami.
          </p>
        </Reveal>

        <Reveal className="rounded-3xl border border-gold-champagne/30 bg-ivory-card p-6 shadow-luxury sm:p-9">
          <form onSubmit={submit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="rsvp-name"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-sage-deep"
              >
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="rsvp-name"
                name="name"
                required
                maxLength={60}
                autoComplete="name"
                value={nama}
                onChange={(event) => setNama(event.target.value)}
                placeholder="Masukkan nama Anda"
                aria-invalid={Boolean(errors.nama)}
                className="w-full rounded-2xl border border-sage-soft/30 bg-ivory-base px-4 py-3 text-sm text-sage-deep transition placeholder:text-sage-soft/50 focus:border-gold-champagne focus:outline-none focus:ring-2 focus:ring-gold-champagne/20"
              />
              {errors.nama && (
                <p className="mt-1 text-xs text-rose-600">{errors.nama}</p>
              )}
            </div>

            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-sage-deep">
                Konfirmasi Kehadiran
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {ATTENDANCE.map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="attendance"
                      value={option.value}
                      checked={hadir === option.value}
                      onChange={() => setHadir(option.value)}
                      className="peer sr-only"
                    />
                    <span
                      className={`block rounded-2xl border border-sage-soft/30 bg-ivory-base px-2 py-2.5 text-center text-xs font-medium text-sage-soft transition sm:text-sm ${option.active}`}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div
              className={
                hadir === "tidak"
                  ? "pointer-events-none opacity-50 transition-opacity"
                  : "transition-opacity"
              }
            >
              <label
                htmlFor="rsvp-guests"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-sage-deep"
              >
                Jumlah Tamu
              </label>
              <select
                id="rsvp-guests"
                name="guests"
                value={jumlah}
                onChange={(event) => setJumlah(Number(event.target.value))}
                className="w-full rounded-2xl border border-sage-soft/30 bg-ivory-base px-4 py-3 text-sm text-sage-deep transition focus:border-gold-champagne focus:outline-none focus:ring-2 focus:ring-gold-champagne/20"
              >
                {Array.from({ length: 10 }, (_, index) => index + 1).map(
                  (count) => (
                    <option key={count} value={count}>
                      {count} Orang
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="rsvp-message"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-sage-deep"
              >
                Ucapan &amp; Doa <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="rsvp-message"
                name="message"
                rows={3}
                required
                maxLength={600}
                value={pesan}
                onChange={(event) => setPesan(event.target.value)}
                placeholder="Tuliskan ucapan selamat & doa terbaik untuk Mirza & Ira..."
                aria-invalid={Boolean(errors.pesan)}
                className="w-full resize-none rounded-2xl border border-sage-soft/30 bg-ivory-base px-4 py-3 text-sm text-sage-deep transition placeholder:text-sage-soft/50 focus:border-gold-champagne focus:outline-none focus:ring-2 focus:ring-gold-champagne/20"
              />
              <div className="mt-1 flex items-start justify-between gap-3">
                {errors.pesan ? (
                  <p className="text-xs text-rose-600">{errors.pesan}</p>
                ) : (
                  <span />
                )}
                <span className="ml-auto text-[10px] text-sage-soft/70">
                  {pesan.length}/600
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sage-deep to-sage-darker px-6 py-3.5 text-sm font-semibold text-ivory-base shadow-luxury transition-all duration-300 hover:brightness-110 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
            >
              <svg
                className="h-4 w-4 text-gold-light"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>
                {sending ? "Mengirim…" : "Kirim Ucapan & Konfirmasi"}
              </span>
            </button>

            {!isSupabaseReady && (
              <p className="text-center text-[10px] leading-relaxed text-sage-soft/80">
                Mode demo: ucapan tersimpan di perangkat ini. Hubungkan Supabase
                agar tersimpan permanen dan tampil untuk semua tamu.
              </p>
            )}
          </form>

          <div className="mt-8 flex items-center justify-between border-t border-sage-soft/15 pt-6">
            <h3 className="font-serif text-xl font-bold text-sage-deep">
              Untaian Doa Tamu
            </h3>
            <span className="rounded-full bg-sage-mist px-3 py-1 text-xs font-semibold text-sage-deep">
              {wishes.length} Ucapan
            </span>
          </div>

          {notice && (
            <p className="mt-3 rounded-2xl border border-gold-champagne/30 bg-ivory-warm px-4 py-3 text-xs leading-relaxed text-sage-soft">
              {notice}
            </p>
          )}

          <div
            id="wishes-list"
            className="custom-scrollbar mt-4 max-h-96 space-y-3.5 overflow-y-auto pr-1"
            aria-live="polite"
          >
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl border border-sage-soft/20 bg-ivory-base p-4 sm:p-5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-sage-mist" />
                    <span className="h-3 w-32 rounded bg-sage-mist" />
                  </div>
                  <div className="h-3 w-full rounded bg-sage-mist" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-sage-mist" />
                </div>
              ))
            ) : wishes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-sage-soft/30 px-4 py-10 text-center">
                <p className="font-serif text-lg text-sage-deep">
                  Belum ada ucapan.
                </p>
                <p className="mt-1 text-xs text-sage-soft">
                  Jadilah yang pertama mengirimkan doa untuk kami.
                </p>
              </div>
            ) : (
              wishes.map((wish) => {
                const ragu = wish.kehadiran === "ragu";
                const absent = wish.kehadiran === "tidak";
                const badge = absent
                  ? "bg-rose-100 text-rose-800"
                  : ragu
                    ? "bg-amber-100 text-amber-800"
                    : "bg-sage-mist text-sage-deep";
                const guestLabel = absent
                  ? ""
                  : ` • ${wish.jumlah_tamu} Tamu`;

                return (
                  <article
                    key={wish.id}
                    className="rounded-2xl border border-sage-soft/20 bg-ivory-base p-4 sm:p-5"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-deep font-serif text-sm font-bold text-gold-light">
                          {wish.nama.trim().charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold leading-tight text-sage-deep sm:text-sm">
                            {wish.nama}
                          </h4>
                          <span className="text-[10px] text-sage-soft">
                            {timeAgo(wish.created_at)}
                            {guestLabel}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${badge}`}
                      >
                        {absent
                          ? "Tidak Bisa Hadir"
                          : ragu
                            ? "Masih Ragu"
                            : "Hadir"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-sage-deep/90 sm:text-sm">
                      {wish.pesan}
                    </p>
                  </article>
                );
              })
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
