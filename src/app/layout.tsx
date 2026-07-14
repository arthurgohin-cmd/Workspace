import type { Metadata } from "next";
import { Zilla_Slab, Work_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const displayFont = Zilla_Slab({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sansFont = Work_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "CARVER INVEST",
  description: "Marchand de biens — Paris · Cannes · Miami",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = (await headers()).get("x-locale") ?? "fr";

  return (
    <html lang={lang} className={`${displayFont.variable} ${sansFont.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-stone-100 text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
