# Undangan Pernikahan Mirza & Ira

Undangan pernikahan digital berbasis foto untuk **Muhammad Mirza Fahlefi** dan **Ira Rahmawati**. Desain memakai nuansa sage green, ivory, dan gold dengan foto prewedding, ornamen botani, sampul layar penuh, galeri lightbox, amplop digital, serta buku ucapan realtime.

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS 3.4 + sistem desain di `app/globals.css`
- **Database:** Supabase (buku ucapan & konfirmasi kehadiran)
- **Foto:** `next/image` (optimasi otomatis, lazy loading, prioritas untuk sampul)
- **Musik:** berkas MP3 latar (`public/audio/musik.mp3`) dengan fade-in/out
- **Font:** Cormorant Garamond, Plus Jakarta Sans, Great Vibes, Amiri (via `next/font`)

## Menjalankan proyek

```bash
npm install
cp .env.local.example .env.local   # isi kredensial Supabase (opsional)
npm run dev
```

Buka <http://localhost:3000>. Tanpa konfigurasi Supabase, formulir ucapan tetap berfungsi dalam **mode demo**: data disimpan di `localStorage` perangkat dan hanya terlihat oleh pengirim.

### Build produksi

```bash
npm run build
npm start
```

## Menyiapkan Supabase

1. Buat proyek baru di <https://supabase.com>.
2. Buka **SQL Editor → New query**, tempel seluruh isi `supabase/schema.sql`, lalu **Run**.
   Skrip ini membuat tabel `ucapan`, indeks, kebijakan RLS (baca & tulis publik), dan mengaktifkan realtime.
3. Buka **Project Settings → API**, salin `Project URL` dan `anon public key`.
4. Isi `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Opsional, untuk URL absolut gambar pratinjau (Open Graph)
NEXT_PUBLIC_SITE_URL=https://domain-anda.com
```

5. Jalankan ulang server. Ucapan baru akan tampil realtime untuk semua tamu.

> Kunci `anon` memang aman dipakai di browser selama RLS aktif. Jangan pernah memakai `service_role` di aplikasi klien.

## Format tautan tamu

Nama tamu dibaca dari parameter `?to=` pada URL:

```
https://domain-anda.com/?to=Bapak%20Joko%20Susilo
https://domain-anda.com/?to=Ibu%20Sari%20Wulandari
```

Nama akan tampil di halaman sampul dan otomatis terisi pada formulir ucapan. Bila parameter tidak ada, dipakai nama umum **“Bapak/Ibu/Saudara/i”**.

## Kustomisasi

Semua data pernikahan terpusat di **`lib/wedding.ts`**:

| Bagian | Keterangan |
| --- | --- |
| `monogram`, `groom`, `bride` | Nama, urutan anak, orang tua, Instagram |
| `dateISO`, `dateLabel`, `dateShort` | Tanggal utama (hitung mundur & tampilan) |
| `akad`, `resepsi` | Jam, lokasi, alamat, kata kunci Google Maps |
| `banks`, `giftAddress` | Rekening dan alamat kirim hadiah |
| `quote`, `story` | Ayat, kutipan, dan narasi kisah |
| `guestFallback` | Nama tamu bawaan |

Tanggal, venue, rekening, dan kisah saat ini adalah **contoh** — silakan ganti dengan data sebenarnya. Tanggal utama juga dipakai untuk hitung mundur dan tautan Google Calendar.

Foto berada di `public/images/adat/`:

| Berkas | Dipakai di |
| --- | --- |
| `adat-cover.jpg` | Sampul pembuka |
| `adat-couple-umbrella.jpg` | Latar hero & galeri |
| `adat-couple-stand.jpg` | Foto utama hero & galeri |
| `adat-couple-look.jpg` | Ayat |
| `adat-couple-close.jpg` | Kisah |
| `adat-groom.jpg` | Galeri (mempelai pria) |
| `adat-bride.jpg` | Galeri (mempelai wanita) |

Ganti berkas dengan nama yang sama (disarankan rasio potret 3:4) agar tidak perlu mengubah kode.

Musik latar diambil dari `public/audio/musik.mp3`. Ganti berkas itu untuk mengganti lagu; bila ingin nama lain, ubah konstanta `SRC` di `components/useMusic.ts`.

Pengaturan visual ada di:

- `app/globals.css` — warna, tekstur botani, animasi sampul/reveal, dialog, mode cetak, dan `prefers-reduced-motion`.
- `tailwind.config.ts` — palet `sage`/`ivory`/`gold`/`blush`, keluarga font, dan bayangan.
- `app/layout.tsx` — metadata, font, dan tema.
- `app/opengraph-image.jpg` — gambar pratinjau 1200×630 saat tautan dibagikan.

## Animasi

Sentuhan gerak dibuat ringan dan tidak mengganggu keterbacaan:

| Animasi | Di mana | Cara kerja |
| --- | --- | --- |
| Tirai sampul + zoom foto | `Cover.tsx` | Transisi `transform` saat undangan dibuka |
| Parallax latar hero | `Hero.tsx` | Latar bergerak lebih lambat dari konten memakai `animation-timeline: scroll(root)` |
| Parallax foto | Hero, ayat, kisah | CSS Scroll-Driven Animation (`animation-timeline: view()`) tanpa listener scroll |
| Reveal 3D | Semua `Reveal` | Fade + `rotateX` lembut saat masuk viewport |
| Kartu miring 3D | Mempelai, acara, rekening | `Tilt.tsx` mengikuti pointer mouse + pantulan cahaya |
| Flip angka 3D | Hitung mundur | Animasi `rotateX` setiap angka berubah |
| Lightbox | Galeri | `<dialog>` native dengan transisi `@starting-style` |

Semua animasi otomatis nonaktif atau disederhanakan saat pengguna mengaktifkan **prefers-reduced-motion**. Parallax hanya berjalan di browser yang mendukung scroll-driven animations; browser lain tetap menampilkan foto statis.

## Struktur singkat

```
app/
  layout.tsx          font & metadata
  page.tsx            halaman undangan
  globals.css         sistem desain & animasi
  opengraph-image.jpg pratinjau tautan
components/
  site/
    Site.tsx          orkestrasi sampul, tamu, musik, toast
    Cover.tsx         sampul layar penuh + nama tamu
    Hero.tsx          pembuka, hitung mundur, Google Calendar
    Quote.tsx         QS. Ar-Rum : 21
    Couple.tsx        profil mempelai & kisah
    Events.tsx        akad & resepsi
    Gallery.tsx       galeri foto + lightbox <dialog>
    Gift.tsx          amplop digital & salin rekening
    Wishes.tsx        formulir & daftar ucapan
    Chrome.tsx        navigasi bawah, tombol musik, toast
    Reveal.tsx        animasi 3D saat digulir
    Tilt.tsx          kartu 3D mengikuti kursor
  useMusic.ts         pemutar musik latar (MP3)
lib/
  wedding.ts          pusat data undangan
  supabase.ts         klien & tipe data
public/images/adat/   foto busana adat
public/audio/         berkas musik latar
supabase/
  schema.sql          tabel, RLS, realtime
```

## Catatan teknis

- **Sampul & musik.** Halaman terkunci sampai tombol “Buka Undangan” ditekan. Klik tersebut juga memulai musik MP3 (gestur pengguna diperlukan browser), dan tombol piringan di kanan bawah dapat menjeda/memutar kembali.
- **Galeri.** Memakai elemen `<dialog>` native: fokus terkunci otomatis, `Esc` menutup, klik latar menutup, serta navigasi tombol panah dan geser (swipe) di ponsel.
- **Navigasi.** Bilah bawah mengambang dengan penanda bagian aktif; tombol salin memakai Clipboard API dengan fallback `execCommand`.
- **Aksesibilitas.** Mendukung `prefers-reduced-motion`, tampilan cetak, label formulir, status fokus yang jelas, dan `aria-live` untuk toast serta daftar ucapan.
- **Fallback.** Bila Supabase belum diatur, ucapan disimpan lokal (mulai dari daftar kosong) dan aplikasi menampilkan pemberitahuan mode demo.

## Deploy

Cara termudah adalah **Vercel**:

1. Hubungkan repositori ke Vercel.
2. Tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di **Environment Variables**. Tambahkan juga `NEXT_PUBLIC_SITE_URL` berisi domain final agar gambar pratinjau memakai URL absolut.
3. Deploy. Bagikan tautan dengan parameter `?to=` sesuai nama tamu.

---

Dibuat dengan doa untuk hari bahagia Mirza & Ira.
