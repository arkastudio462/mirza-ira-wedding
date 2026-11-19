import type { Metadata, Viewport } from "next";
import {
  Amiri,
  Cormorant_Garamond,
  Great_Vibes,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--ff-serif",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--ff-sans",
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--ff-script",
  display: "swap",
});

const arabic = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--ff-arabic",
  display: "swap",
});

// Utamakan domain produksi (stabil) agar pratinjau tautan WhatsApp/OG
// menunjuk ke alamat yang benar, bukan hostname deployment sementara.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: "The Wedding of Mirza & Ira — Sabtu, 19 Desember 2026",
  description:
    "Undangan pernikahan Muhammad Mirza Fahlefi & Ira Rahmawati. Sabtu, 19 Desember 2026 di Jakarta. Dengan penuh sukacita, kami mengundang Anda untuk hadir dan memberikan doa restu.",
  keywords: [
    "undangan pernikahan",
    "undangan digital",
    "Mirza",
    "Ira",
    "Jakarta",
    "wedding invitation",
  ],
  authors: [{ name: "Muhammad Mirza Fahlefi" }],
  openGraph: {
    title: "The Wedding of Mirza & Ira",
    description:
      "Sabtu, 19 Desember 2026 — Jakarta. Kami menantikan doa dan kehadiran Anda.",
    url: "/",
    siteName: "The Wedding of Mirza & Ira",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Wedding of Mirza & Ira",
    description: "Sabtu, 19 Desember 2026 — Jakarta.",
  },
};

export const viewport: Viewport = {
  themeColor: "#2D4739",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${serif.variable} ${sans.variable} ${script.variable} ${arabic.variable} scroll-smooth`}
    >
      <body className="bg-botanical-pattern text-sage-deep selection:bg-gold-champagne/25 selection:text-sage-deep">
        {children}
      </body>
    </html>
  );
}
