import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getFeaturedProjects, getProjectCounts } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";
import { notFound } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);

  const [inProgress, completed, counts] = await Promise.all([
    getFeaturedProjects("IN_PROGRESS", 3),
    getFeaturedProjects("COMPLETED", 3),
    getProjectCounts(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #fbf6ee 0px, #fbf6ee 1px, transparent 1px, transparent 40px)",
          }}
        />
        <div className="container-page relative flex min-h-[86vh] flex-col justify-center gap-8 py-32">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-terracotta-light">
            {dict.home.eyebrow}
          </p>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            {dict.home.titleLine1}
            <br />
            <span className="text-terracotta-light">{dict.home.titleLine2}</span>
          </h1>
          <p className="max-w-xl text-lg text-paper/75">{dict.home.sub}</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href={`/${typedLocale}/projets`}
              className="rounded-sm bg-paper px-7 py-3.5 text-sm font-medium text-ink transition hover:bg-terracotta-light"
            >
              {dict.home.ctaProjects}
            </Link>
            <Link
              href={`/${typedLocale}/investir`}
              className="rounded-sm border border-paper/40 px-7 py-3.5 text-sm font-medium text-paper transition hover:border-paper hover:bg-paper/10"
            >
              {dict.home.ctaInvest}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-b border-stone-300/60 bg-stone-200/60">
        <div className="container-page grid grid-cols-2 gap-8 py-10 sm:grid-cols-3">
          <div>
            <span className="font-display text-4xl text-terracotta">{counts.total}</span>
            <p className="text-sm text-stone-400">{dict.home.statsProjects}</p>
          </div>
          <div>
            <span className="font-display text-4xl text-terracotta">{counts.cityCount}</span>
            <p className="text-sm text-stone-400">{dict.home.statsCities}</p>
          </div>
          <div>
            <span className="font-display text-4xl text-terracotta">2</span>
            <p className="text-sm text-stone-400">{dict.home.statsCountries}</p>
          </div>
        </div>
      </section>

      {/* Three cities */}
      <section className="container-page py-24">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">{dict.home.citiesTitle}</h2>
          <p className="mt-4 text-stone-400">{dict.home.citiesSub}</p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-sm bg-stone-300 sm:grid-cols-3">
          {[
            { name: dict.cities.PARIS, text: dict.home.cityParisText },
            { name: dict.cities.CANNES, text: dict.home.cityCannesText },
            { name: dict.cities.MIAMI, text: dict.home.cityMiamiText },
          ].map((city) => (
            <div key={city.name} className="flex flex-col gap-3 bg-paper p-8">
              <h3 className="font-display text-2xl text-terracotta">{city.name}</h3>
              <p className="text-sm text-stone-400">{city.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured: in progress */}
      {inProgress.length > 0 && (
        <section className="bg-stone-200/50 py-24">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl text-ink sm:text-4xl">
                  {dict.home.featuredTitle}
                </h2>
                <p className="mt-2 text-stone-400">{dict.home.featuredSub}</p>
              </div>
              <Link
                href={`/${typedLocale}/projets?status=IN_PROGRESS`}
                className="text-sm font-medium text-terracotta hover:underline"
              >
                {dict.home.seeAllProjects}
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {inProgress.map((project) => (
                <ProjectCard key={project.id} project={project} locale={typedLocale} dict={dict} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured: completed */}
      {completed.length > 0 && (
        <section className="py-24">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl text-ink sm:text-4xl">
                  {dict.home.completedTitle}
                </h2>
                <p className="mt-2 text-stone-400">{dict.home.completedSub}</p>
              </div>
              <Link
                href={`/${typedLocale}/projets?status=COMPLETED`}
                className="text-sm font-medium text-terracotta hover:underline"
              >
                {dict.home.seeAllProjects}
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {completed.map((project) => (
                <ProjectCard key={project.id} project={project} locale={typedLocale} dict={dict} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Invest CTA */}
      <section className="bg-ink py-24 text-paper">
        <div className="container-page flex flex-col items-start gap-6">
          <h2 className="font-display text-3xl sm:text-4xl">{dict.home.investTitle}</h2>
          <p className="max-w-xl text-paper/70">{dict.home.investText}</p>
          <Link
            href={`/${typedLocale}/investir`}
            className="rounded-sm bg-terracotta px-7 py-3.5 text-sm font-medium text-paper transition hover:bg-terracotta-light"
          >
            {dict.home.investCta}
          </Link>
        </div>
      </section>
    </>
  );
}
