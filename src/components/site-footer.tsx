import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="container-page flex flex-col gap-10 py-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/brand/icon-white.png" alt="" width={32} height={30} className="h-8 w-auto" />
              <span className="font-display text-xl tracking-wide">
                CARVER<span className="text-terracotta-light"> INVEST</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-paper/60">{dict.footer.tagline}</p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm sm:grid-cols-3">
            <Link href={`/${locale}/projets`} className="text-paper/70 hover:text-terracotta-light">
              {dict.nav.projects}
            </Link>
            <Link href={`/${locale}/a-propos`} className="text-paper/70 hover:text-terracotta-light">
              {dict.nav.about}
            </Link>
            <Link href={`/${locale}/equipe`} className="text-paper/70 hover:text-terracotta-light">
              {dict.nav.team}
            </Link>
            <Link href={`/${locale}/contact`} className="text-paper/70 hover:text-terracotta-light">
              {dict.nav.contact}
            </Link>
            <Link href={`/${locale}/investir`} className="text-paper/70 hover:text-terracotta-light">
              {dict.nav.invest}
            </Link>
          </nav>
        </div>

        <div className="h-px bg-paper/10" />

        <div className="flex flex-col gap-2 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} CARVER INVEST. {dict.footer.rights}</span>
          <span>{dict.footer.legalNotice}</span>
        </div>
      </div>
    </footer>
  );
}
