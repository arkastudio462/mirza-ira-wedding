-- ═══════════════════════════════════════════════════════════════
--  Skema Supabase untuk buku ucapan undangan Mirza & Ira
--  Jalankan di Supabase → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.ucapan (
  id uuid primary key default gen_random_uuid(),
  nama text not null check (char_length(nama) between 2 and 60),
  kehadiran text not null default 'hadir'
    check (kehadiran in ('hadir', 'ragu', 'tidak')),
  jumlah_tamu smallint not null default 1
    check (jumlah_tamu between 1 and 10),
  pesan text not null check (char_length(pesan) between 2 and 600),
  created_at timestamptz not null default now()
);

create index if not exists ucapan_created_at_idx
  on public.ucapan (created_at desc);

-- Keamanan tingkat baris (RLS)
alter table public.ucapan enable row level security;

-- Semua pengunjung boleh membaca ucapan
drop policy if exists "ucapan dibaca publik" on public.ucapan;
create policy "ucapan dibaca publik"
  on public.ucapan for select
  to anon, authenticated
  using (true);

-- Semua pengunjung boleh menulis ucapan (tanpa login)
drop policy if exists "ucapan ditulis publik" on public.ucapan;
create policy "ucapan ditulis publik"
  on public.ucapan for insert
  to anon, authenticated
  with check (
    char_length(nama) between 2 and 60
    and char_length(pesan) between 2 and 600
    and kehadiran in ('hadir', 'ragu', 'tidak')
    and jumlah_tamu between 1 and 10
  );

-- Aktifkan realtime agar ucapan baru muncul tanpa reload
alter publication supabase_realtime add table public.ucapan;
