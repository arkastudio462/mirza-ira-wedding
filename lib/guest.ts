import { wedding } from "@/lib/wedding";

/** Sapaan umum yang dipakai bila nama tamu tidak menyebut sapaan/gelar. */
export const GENERIC_GREETING = wedding.guestFallback;

/** Padanan baku untuk sapaan yang diketik singkat di URL. */
const SALUTATIONS: Record<string, string> = {
  bapak: "Bapak",
  bpk: "Bpk.",
  ibu: "Ibu",
  nyonya: "Nyonya",
  ny: "Ny.",
  nona: "Nona",
  nn: "Nn.",
  tuan: "Tuan",
  tn: "Tn.",
  saudara: "Saudara",
  sdr: "Sdr.",
  saudari: "Saudari",
  sdri: "Sdri.",
  kakak: "Kakak",
  kak: "Kak",
  mas: "Mas",
  mbak: "Mbak",
  adik: "Adik",
  dik: "Dik",
};

// "Bapak/Ibu", "Bapak/Ibu/Saudara/i", "Bapak/Ibu/Sdr." → sapaan umum.
const GENERIC_PREFIX =
  /^bapak\s*\/\s*ibu(?:\s*\/\s*(?:saudara\s*\/\s*i|saudari?|sdr\.?))?\b\.?[\s,.-]*/i;

// Sapaan tunggal di awal nama: "Bapak Joko", "Sdri. Ani", "Ibu Sari", dst.
const SALUTATION_PREFIX =
  /^(bapak|bpk|ibu|nyonya|ny|nona|nn|tuan|tn|saudara|sdr|saudari|sdri|kakak|kak|mas|mbak|adik|dik)\b\.?[\s,]+/i;

export type GuestGreeting = {
  /** Baris sapaan, mis. "Bapak/Ibu/Saudara/i" atau "Bapak". */
  salutation: string;
  /** Nama tamu tanpa sapaan; bisa kosong bila URL tidak memuat nama. */
  name: string;
};

/**
 * Pisahkan sapaan dari nama tamu pada parameter `?to=`.
 * Sapaan umum tetap ditampilkan meski tamu tidak menyebut gelar,
 * dan tidak diduplikasi bila nama sudah diawali "Bapak"/"Ibu"/dst.
 */
export function parseGuest(raw: string | null | undefined): GuestGreeting {
  const value = (raw ?? "").replace(/\s+/g, " ").trim();
  if (!value) return { salutation: GENERIC_GREETING, name: "" };

  const generic = value.match(GENERIC_PREFIX);
  if (generic) {
    return {
      salutation: GENERIC_GREETING,
      name: value.slice(generic[0].length).trim(),
    };
  }

  const salutation = value.match(SALUTATION_PREFIX);
  if (salutation) {
    const key = salutation[1].toLowerCase();
    return {
      salutation: SALUTATIONS[key] ?? salutation[1],
      name: value.slice(salutation[0].length).trim(),
    };
  }

  return { salutation: GENERIC_GREETING, name: value };
}
