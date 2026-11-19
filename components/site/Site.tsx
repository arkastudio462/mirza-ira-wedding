"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/wedding";
import { useMusic } from "@/components/useMusic";
import Cover from "./Cover";
import Hero from "./Hero";
import Quote from "./Quote";
import Couple from "./Couple";
import Events from "./Events";
import Gallery from "./Gallery";
import Gift from "./Gift";
import Wishes from "./Wishes";
import Chrome from "./Chrome";

type Toast = { message: string; id: number };

export default function Site() {
  const [guest, setGuest] = useState<string>(wedding.guestFallback);
  const [opened, setOpened] = useState(false);
  const [gone, setGone] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | null>(null);
  const { playing, start, toggle } = useMusic();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("to") || params.get("guest");
      if (raw && raw.trim().length > 0) setGuest(raw.trim());
    } catch {
      /* URL tidak valid — pakai nama default */
    }
  }, []);

  useEffect(() => {
    const body = document.body;
    if (opened) {
      body.classList.remove("is-locked");
    } else {
      body.classList.add("is-locked");
    }
    return () => body.classList.remove("is-locked");
  }, [opened]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const notify = useCallback((message: string) => {
    setToast({ message, id: Date.now() });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const openInvitation = () => {
    setOpened(true);
    start();
    window.setTimeout(() => setGone(true), 1200);
  };

  const toggleMusic = async () => {
    const ok = await toggle();
    if (!ok) {
      notify("Berkas musik belum tersedia");
      return;
    }
    notify(playing ? "Musik latar dijeda" : "Musik latar diputar");
  };

  return (
    <>
      <Cover
        guest={guest}
        opened={opened}
        gone={gone}
        onOpen={openInvitation}
      />

      <main>
        <Hero opened={opened} />
        <Quote />
        <Couple />
        <Events />
        <Gallery />
        <Gift notify={notify} />
        <Wishes guest={guest} notify={notify} />

        <footer className="px-4 pb-28 pt-10 text-center sm:pb-32">
          <div className="mx-auto max-w-lg">
            <p className="text-xs leading-relaxed text-sage-soft sm:text-sm">
              Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila
              Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
            </p>
            <p className="mt-4 font-serif text-lg font-semibold text-sage-deep">
              Wassalamu’alaikum Warahmatullahi Wabarakatuh
            </p>
            <p className="mt-4 font-script text-4xl text-gold-champagne sm:text-5xl">
              {wedding.monogram.groom} &amp; {wedding.monogram.bride}
            </p>
            <p className="mt-6 text-[11px] text-sage-soft/75">
              {wedding.dateLabel} • Dibuat dengan penuh cinta
            </p>
          </div>
        </footer>
      </main>

      <Chrome playing={playing} onToggleMusic={toggleMusic} toast={toast} />
    </>
  );
}
