import Image from "next/image";
import { wedding } from "@/lib/wedding";
import Reveal from "./Reveal";
import Tilt from "./Tilt";

const InstagramIcon = () => (
  <svg
    className="h-3.5 w-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Couple() {
  const people = [
    {
      label: "Mempelai Pria",
      badge: "bg-sage-mist/70 text-sage-soft",
      person: wedding.groom,
      heart: false,
    },
    {
      label: "Mempelai Wanita",
      badge: "bg-blush-sunset text-sage-deep",
      person: wedding.bride,
      heart: true,
    },
  ];

  return (
    <section id="mempelai" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal className="mx-auto mb-12 max-w-xl text-center">
          <p className="mb-2 font-arabic text-xl text-sage-deep sm:text-2xl">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <h2 className="font-serif text-3xl font-semibold text-sage-deep sm:text-4xl">
            Assalamu’alaikum Warahmatullahi Wabarakatuh
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-sage-soft sm:text-sm">
            Maha Suci Allah yang telah menciptakan makhluk-Nya
            berpasang-pasangan. Ya Allah, perkenankanlah kami merangkaikan kasih
            sayang yang Kau ciptakan di antara putra-putri kami:
          </p>
        </Reveal>

        <div className="grid grid-cols-1 items-stretch gap-6 sm:gap-8 md:grid-cols-2">
          {people.map(({ label, badge, person, heart }, index) => (
            <Reveal key={person.fullName} className="h-full" delay={index * 120}>
              <Tilt className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-gold-champagne/30 bg-ivory-card p-7 text-center shadow-luxury sm:p-9">
                <svg
                  className="mx-auto mb-4 h-10 w-10 text-gold-champagne/70 transition-transform duration-500 group-hover:scale-110"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  aria-hidden="true"
                >
                  <circle cx="24" cy="24" r="18" strokeDasharray="3 3" />
                  {heart ? (
                    <path d="M24 34s-9-5.5-9-12a5 5 0 019-3 5 5 0 019 3c0 6.5-9 12-9 12z" />
                  ) : (
                    <path d="M24 12C20 18 16 21 16 26a8 8 0 0016 0c0-5-4-8-8-14z" />
                  )}
                </svg>

                <div>
                  <span
                    className={`mb-3 inline-block rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${badge}`}
                  >
                    {label}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-sage-deep sm:text-3xl">
                    {person.fullName}
                  </h3>
                  <p className="mt-0.5 font-script text-2xl text-gold-champagne">
                    {person.shortName}
                  </p>

                  <div className="mx-auto my-4 h-px w-12 bg-gold-champagne/50" />

                  <p className="text-xs leading-relaxed text-sage-soft sm:text-sm">
                    {person.order}
                    <br />
                    <span className="font-semibold text-sage-deep">
                      {person.father}
                    </span>
                    <br />
                    &amp;{" "}
                    <span className="font-semibold text-sage-deep">
                      {person.mother}
                    </span>
                  </p>
                </div>

                <div className="mt-6">
                  <a
                    href={`https://instagram.com/${person.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-sage-soft/25 bg-ivory-warm px-4 py-2 text-xs font-medium text-sage-deep transition-colors duration-300 hover:bg-sage-deep hover:text-ivory-base"
                  >
                    <InstagramIcon />
                    <span>@{person.instagram}</span>
                  </a>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 rounded-3xl border border-gold-champagne/25 bg-gradient-to-br from-blush-sunset/70 via-ivory-card to-sage-mist/60 p-5 shadow-luxury sm:p-8">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
            <div className="md:col-span-6">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-md">
                <Image
                  src="/images/adat/adat-couple-close.jpg"
                  alt="Momen hangat Mirza dan Ira dalam balutan busana adat"
                  fill
                  sizes="(max-width: 768px) 100vw, 440px"
                  className="parallax-photo-soft object-cover object-top"
                />
              </div>
            </div>
            <div className="px-2 text-center md:col-span-6 md:text-left">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-dark">
                Kisah &amp; Harapan
              </span>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-sage-deep sm:text-3xl">
                {wedding.story.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-sage-soft sm:text-sm">
                {wedding.story.text}
              </p>
              <div className="mt-5 inline-flex items-center gap-3 font-serif text-base italic text-sage-deep">
                <span className="h-px w-8 bg-gold-champagne" />
                <span>
                  {wedding.monogram.groom} &amp; {wedding.monogram.bride}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
