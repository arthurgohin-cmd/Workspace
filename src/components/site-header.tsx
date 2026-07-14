import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const otherLocale: Locale = locale === "fr" ? "en" : "fr";

  const links = [
    { href: `/${locale}/projets`, label: dict.nav.projects },
    { href: `/${locale}/a-propos`, label: dict.nav.about },
    { href: `/${locale}/equipe`, label: dict.nav.team },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stone-300/60 bg-stone-100/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <Image src="/brand/icon-ink.png" alt="" width={36} height={34} className="h-9 w-auto" priority />
          <span className="font-display text-xl tracking-wide text-ink">
            CARVER<span className="text-terracotta"> INVEST</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/80 transition hover:text-terracotta"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={`/${otherLocale}`}
            className="text-sm font-medium text-ink/60 transition hover:text-terracotta"
            aria-label={otherLocale === "en" ? "Switch to English" : "Passer en français"}
          >
            {otherLocale.toUpperCase()}
          </Link>
          <Link
            href={`/${locale}/investir`}
            className="hidden rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-terracotta sm:inline-block"
          >
            {dict.nav.cta}
          </Link>

          <details className="group relative md:hidden">
            <summary className="flex h-9 w-9 cursor-pointer list-none flex-col items-center justify-center gap-1.5 [&::-webkit-details-marker]:hidden">
              <span className="h-px w-5 bg-ink transition group-open:translate-y-[3px] group-open:rotate-45" />
              <span className="h-px w-5 bg-ink transition group-open:-translate-y-[3px] group-open:-rotate-45" />
            </summary>
            <nav className="absolute right-0 top-12 flex w-56 flex-col gap-1 rounded-sm border border-stone-300 bg-paper p-3 shadow-lg">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-sm px-3 py-2 text-sm font-medium text-ink/80 transition hover:bg-stone-100 hover:text-terracotta"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={`/${locale}/investir`}
                className="mt-1 rounded-sm bg-ink px-3 py-2 text-center text-sm font-medium text-paper transition hover:bg-terracotta"
              >
                {dict.nav.cta}
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
