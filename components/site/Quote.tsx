import Image from "next/image";
import { wedding } from "@/lib/wedding";
import Reveal from "./Reveal";

const ARABIC =
  "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ";

export default function Quote() {
  return (
    <section
      id="ayat-suci"
      className="border-y border-gold-champagne/20 bg-ivory-warm/80 px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-4xl">
        <Reveal className="rounded-3xl border border-gold-champagne/25 bg-ivory-card p-6 shadow-luxury sm:p-10 md:p-12">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
            <div className="flex justify-center md:col-span-5">
              <div className="relative aspect-[3/4] w-56 sm:w-64">
                <div className="absolute -inset-2 rounded-[9999px_9999px_1.25rem_1.25rem] border border-sage-soft/30" />
                <div className="arch-frame relative h-full w-full overflow-hidden shadow-md">
                  <Image
                    src="/images/adat/adat-couple-look.jpg"
                    alt="Mirza dan Ira saling menatap dalam balutan busana adat"
                    fill
                    sizes="(max-width: 640px) 224px, 256px"
                    className="parallax-photo-soft object-cover object-top"
                  />
                </div>
              </div>
            </div>

            <div className="text-center md:col-span-7 md:text-left">
              <div className="mb-3 inline-flex items-center gap-2 text-gold-champagne">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2C9 7 4 9 4 14a8 8 0 0016 0c0-5-5-7-8-12zm0 16a4 4 0 01-4-4c0-2.5 2-4.2 4-7.2 2 3 4 4.7 4 7.2a4 4 0 01-4 4z" />
                </svg>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sage-soft">
                  Tanda Kebesaran-Nya
                </span>
              </div>

              <p
                dir="rtl"
                lang="ar"
                className="my-4 text-center font-arabic text-2xl leading-[2.1] text-sage-deep sm:text-3xl md:text-right"
              >
                {ARABIC}
              </p>

              <blockquote className="border-l-2 border-gold-champagne pl-4 text-left font-serif text-base italic leading-relaxed text-sage-deep/90 sm:text-lg">
                “{wedding.quote.text}”
              </blockquote>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold-dark sm:text-sm">
                — {wedding.quote.source} —
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
