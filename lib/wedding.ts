/**
 * ═══════════════════════════════════════════════════════════════════
 *  PUSAT DATA UNDANGAN
 *  Ubah semua detail pernikahan di file ini — tampilan akan mengikuti.
 * ═══════════════════════════════════════════════════════════════════
 */

export const wedding = {
  /** Nama panggilan yang tampil besar di halaman sampul */
  monogram: { groom: "Mirza", bride: "Ira", ampersand: "&" },

  groom: {
    fullName: "Muhammad Mirza Fahlefi",
    shortName: "Mirza",
    order: "Putra Ketiga dari Keluarga",
    father: "Bapak Bejo Utomo (Alm)",
    mother: "Ibu Lastri Lestari",
    instagram: "mmirzafahlefi",
  },

  bride: {
    fullName: "Ira Rahmawati",
    shortName: "Ira",
    order: "Putri Pertama dari Keluarga",
    father: "Bapak Lala.S",
    mother: "Ibu Djuhariah",
    instagram: "irarahmawati",
  },

  /** Tanggal utama (ISO 8601, zona waktu WIB) */
  dateISO: "2026-12-20T08:00:00+07:00",
  dateLabel: "Minggu, 20 Desember 2026",
  dateShort: "20 . 12 . 2026",

  akad: {
    title: "Akad Nikah",
    time: "Pukul 08.00 – 10.00 WIB",
    start: "2026-12-20T08:00:00+07:00",
    end: "2026-12-20T10:00:00+07:00",
    venue: "Kediaman Mempelai Pria",
    address:
      "Jl. Pembangunan No.103, Rt. 04/02, Kel. Serua, Kec. Ciputat, Tangerang Selatan, 15414",
    maps: "jl.pembangunan, serua, ciputat",
  },

  resepsi: {
    title: "Resepsi Pernikahan",
    time: "Pukul 11.00 – Selesai",
    start: "2026-12-20T11:00:00+07:00",
    end: "2026-12-20T24:00:00+07:00",
    venue: "Kediaman Mempelai Pria",
    address: "Jl. Pembangunan No.103, Rt. 04/02, Kel. Serua, Kec. Ciputat, Tangerang Selatan, 15414",
    maps: "jl.pembangunan, serua, ciputat",
  },

  /** Rekening untuk tanda kasih (amplop digital) */
  banks: [
    {
      bank: "BANK BCA",
      number: "0670539563",
      holder: "Muhammad Mirza Fahlefi",
      color: "from-sage-deep via-sage-darker to-[#17271F]",
    },
    {
      bank: "BANK ALADIN",
      number: "50699963200",
      holder: "Ira Rahmawati",
      color: "from-[#3B5949] via-sage-deep to-sage-darker",
    },
  ],

  giftAddress: {
    name: "Mirza & Ira (0895-1382-4844)",
    detail:
      "Jl. Pembangunan No.103, Rt. 04/02, Kel. Serua, Kec. Ciputat, Tangerang Selatan, 15414",
  },

  quote: {
    text: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
    source: "QS. Ar-Rum : 21",
  },

  story: {
    title: "Satu Langkah Menuju Ibadah Terpanjang",
    text: "Berawal dari pertemuan sederhana yang dipenuhi doa baik, Allah mempertemukan hati kami dalam keyakinan yang sama. Kini, dengan penuh rasa syukur, kami melangkah bersama untuk membangun keluarga yang sakinah, mawaddah, warahmah.",
  },

  /** Nama tamu default bila URL tidak memakai ?to= */
  guestFallback: "Bapak/Ibu/Saudara/i",
} as const;

export type Wedding = typeof wedding;

/** Format nomor rekening agar mudah dibaca */
export function formatAccountNumber(value: string) {
  return value.replace(/(.{4})/g, "$1 ").trim();
}
