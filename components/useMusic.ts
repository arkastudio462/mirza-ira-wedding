"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Musik latar dari berkas MP3.
 * Taruh berkasnya di `public/audio/musik.mp3` (ganti `SRC` bila nama lain).
 */
const SRC = "/audio/musik.mp3";
const VOLUME = 0.45;
const FADE_IN_MS = 1_400;
const FADE_OUT_MS = 400;

export function useMusic() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);

  const clearFade = useCallback(() => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  /** Ubah volume perlahan agar musik tidak muncul/mati mendadak. */
  const fadeTo = useCallback(
    (target: number, duration: number, done?: () => void) => {
      clearFade();
      const audio = audioRef.current;
      if (!audio) {
        done?.();
        return;
      }
      if (duration <= 0) {
        audio.volume = target;
        done?.();
        return;
      }

      const from = audio.volume;
      const startedAt = performance.now();
      fadeRef.current = window.setInterval(() => {
        const el = audioRef.current;
        if (!el) {
          clearFade();
          return;
        }
        const progress = Math.min(1, (performance.now() - startedAt) / duration);
        el.volume = Math.max(
          0,
          Math.min(1, from + (target - from) * progress),
        );
        if (progress >= 1) {
          clearFade();
          done?.();
        }
      }, 40);
    },
    [clearFade],
  );

  /** Mulai musik. Mengembalikan `false` bila berkas tidak bisa diputar. */
  const start = useCallback(async () => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(SRC);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0;
      audioRef.current = audio;
    }

    try {
      await audio.play();
    } catch {
      // Berkas hilang/format tidak didukung: buang elemen agar percobaan
      // berikutnya memuat ulang dari awal.
      if (audioRef.current === audio) audioRef.current = null;
      return false;
    }

    setPlaying(true);
    fadeTo(VOLUME, FADE_IN_MS);
    return true;
  }, [fadeTo]);

  const stop = useCallback(() => {
    setPlaying(false);
    fadeTo(0, FADE_OUT_MS, () => audioRef.current?.pause());
  }, [fadeTo]);

  /**
   * Balikkan status musik.
   * `true` = berhasil diputar/dijeda, `false` = gagal memutar berkas.
   */
  const toggle = useCallback(async () => {
    if (playing) {
      stop();
      return true;
    }
    return start();
  }, [playing, start, stop]);

  useEffect(() => {
    return () => {
      clearFade();
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
      audioRef.current = null;
    };
  }, [clearFade]);

  return { playing, start, stop, toggle };
}
