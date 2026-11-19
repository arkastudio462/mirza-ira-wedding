import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Attendance = "hadir" | "ragu" | "tidak";

export type Wish = {
  id: string;
  nama: string;
  kehadiran: Attendance;
  jumlah_tamu: number;
  pesan: string;
  created_at: string;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True bila kredensial Supabase tersedia. */
export const isSupabaseReady = Boolean(url && key);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseReady) return null;
  if (!client) {
    client = createClient(url!, key!, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export const TABLE = "ucapan";
export const LOCAL_KEY = "mirza-ira:ucapan";
