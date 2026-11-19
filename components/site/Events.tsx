import { wedding } from "@/lib/wedding";
import Reveal from "./Reveal";
import Tilt from "./Tilt";

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-gold-champagne"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-gold-champagne"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      className="h-4 w-4 text-gold-light"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function Events() {
  const events = [
    { ...wedding.akad, icon: "rings" as const },
    { ...wedding.resepsi, icon: "arch" as const },
  ];

  return (
    <section
      id="acara"
      className="relative overflow-hidden bg-sage-deep px-4 py-16 text-ivory-base sm:px-6 sm:py-24"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-champagne/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sage-soft/20 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <Reveal className="mx-auto mb-12 max-w-xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-light">
            Save The Date
          </span>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-white sm:text-5xl">
            Rangkaian Acara
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-ivory-warm/80 sm:text-sm">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
            Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {events.map((event, index) => (
            <Reveal key={event.title} className="h-full" delay={index * 120}>
              <Tilt className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-gold-champagne/40 bg-ivory-base p-7 text-center text-sage-deep shadow-2xl sm:p-9">
                <div>
                  <div
                    className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${
                      event.icon === "rings"
                        ? "bg-sage-mist/80"
                        : "bg-blush-sunset"
                    }`}
                  >
                    {event.icon === "rings" ? (
                      <svg
                        className="h-7 w-7 text-gold-dark"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        aria-hidden="true"
                      >
                        <circle cx="9" cy="14" r="5" />
                        <circle cx="15" cy="14" r="5" />
                        <path d="M12 5l2-2 2 2-2 2-2-2z" />
                      </svg>
                    ) : (
                      <svg
                        className="h-7 w-7 text-gold-dark"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        aria-hidden="true"
                      >
                        <path d="M4 21V11a8 8 0 0116 0v10" />
                        <path d="M2 21h20" />
                        <path d="M12 3v3M7 5l1.5 2M17 5l-1.5 2" />
                      </svg>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-sage-deep sm:text-3xl">
                    {event.title}
                  </h3>
                  <div className="mx-auto my-4 h-0.5 w-12 bg-gold-champagne" />

                  <div className="space-y-2.5 text-sm">
                    <p className="flex items-center justify-center gap-2 font-semibold text-sage-deep">
                      <CalendarIcon />
                      <span>{wedding.dateLabel}</span>
                    </p>
                    <p className="flex items-center justify-center gap-2 font-medium text-sage-soft">
                      <ClockIcon />
                      <span>{event.time}</span>
                    </p>
                  </div>

                  <div className="mt-5 border-t border-sage-soft/15 pt-5">
                    <p className="font-serif text-lg font-bold text-sage-deep">
                      {event.venue}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-sage-soft">
                      {event.address}
                    </p>
                  </div>
                </div>

                <div className="mt-7">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      event.maps,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sage-deep px-6 py-3 text-xs font-medium text-ivory-base transition-colors duration-300 hover:bg-sage-darker sm:w-auto sm:text-sm"
                  >
                    <PinIcon />
                    <span>Lihat Lokasi Maps</span>
                  </a>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
