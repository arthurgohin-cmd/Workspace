import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getAllProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";
import type { City, ProjectStatus } from "@/generated/prisma/enums";

const STATUS_VALUES: ProjectStatus[] = ["IN_PROGRESS", "COMPLETED"];
const CITY_VALUES: City[] = ["PARIS", "CANNES", "MIAMI"];

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string; city?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);

  const query = await searchParams;
  const status = STATUS_VALUES.includes(query.status as ProjectStatus)
    ? (query.status as ProjectStatus)
    : undefined;
  const city = CITY_VALUES.includes(query.city as City) ? (query.city as City) : undefined;

  const projects = await getAllProjects({ status, city });

  function filterHref(next: { status?: ProjectStatus; city?: City }) {
    const params = new URLSearchParams();
    if (next.status) params.set("status", next.status);
    if (next.city) params.set("city", next.city);
    const qs = params.toString();
    return `/${typedLocale}/projets${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="container-page py-20">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl text-ink sm:text-5xl">{dict.projects.title}</h1>
        <p className="mt-4 text-stone-400">{dict.projects.sub}</p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <FilterPill href={filterHref({ city })} active={!status} label={dict.projects.filterAll} />
        <FilterPill
          href={filterHref({ status: "IN_PROGRESS", city })}
          active={status === "IN_PROGRESS"}
          label={dict.projects.filterInProgress}
        />
        <FilterPill
          href={filterHref({ status: "COMPLETED", city })}
          active={status === "COMPLETED"}
          label={dict.projects.filterCompleted}
        />
        <span className="mx-2 hidden h-6 w-px bg-stone-300 sm:block" />
        {CITY_VALUES.map((c) => (
          <FilterPill
            key={c}
            href={filterHref({ status, city: city === c ? undefined : c })}
            active={city === c}
            label={dict.cities[c]}
          />
        ))}
      </div>

      {projects.length === 0 ? (
        <p className="mt-16 text-stone-400">{dict.projects.empty}</p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} locale={typedLocale} dict={dict} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "border-terracotta bg-terracotta text-paper"
          : "border-stone-300 text-ink/70 hover:border-terracotta hover:text-terracotta"
      }`}
    >
      {label}
    </Link>
  );
}
