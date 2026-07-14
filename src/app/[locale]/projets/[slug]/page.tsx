import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getProjectBySlug, localizedDescription, getAllProjects } from "@/lib/projects";
import { StatusPill } from "@/components/status-pill";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { ProjectCard } from "@/components/project-card";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const photosGeneral = project.media.filter((m) => m.type === "PHOTO" && m.phase === "GENERAL");
  const photosBefore = project.media.filter((m) => m.type === "PHOTO" && m.phase === "BEFORE");
  const photosAfter = project.media.filter((m) => m.type === "PHOTO" && m.phase === "AFTER");
  const videos = project.media.filter((m) => m.type === "VIDEO");
  const tours3d = project.media.filter((m) => m.type === "TOUR_3D");
  const cover = photosGeneral[0] ?? photosAfter[0];

  const dateFormatter = new Intl.DateTimeFormat(typedLocale === "en" ? "en-US" : "fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink sm:aspect-[21/9]">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.caption ?? project.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <MediaPlaceholder seed={project.slug} label={project.title} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="container-page absolute bottom-8 left-0 right-0 text-paper">
          <Link
            href={`/${typedLocale}/projets`}
            className="text-sm text-paper/70 hover:text-paper"
          >
            ← {dict.project.back}
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusPill status={project.status} dict={dict} />
            <span className="text-sm uppercase tracking-wide text-paper/70">
              {dict.cities[project.city]}
            </span>
          </div>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">{project.title}</h1>
        </div>
      </div>

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-12">
          <p className="max-w-2xl text-lg leading-relaxed text-ink/80">
            {localizedDescription(project, typedLocale) || dict.project.descriptionTbd}
          </p>

          {(photosBefore.length > 0 || photosAfter.length > 0) && (
            <div>
              <h2 className="font-display text-2xl text-ink">{dict.project.beforeAfter}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <MediaColumn label={dict.project.before} items={photosBefore} />
                <MediaColumn label={dict.project.after} items={photosAfter} />
              </div>
            </div>
          )}

          {photosGeneral.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-ink">{dict.project.gallery}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {photosGeneral.map((photo) => (
                  <div key={photo.id} className="relative aspect-[4/3] overflow-hidden rounded-sm">
                    <Image
                      src={photo.url}
                      alt={photo.caption ?? project.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-ink">{dict.project.videos}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {videos.map((video) => (
                  <video key={video.id} src={video.url} controls className="w-full rounded-sm" />
                ))}
              </div>
            </div>
          )}

          {tours3d.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-ink">{dict.project.tours3d}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {tours3d.map((tour) => (
                  <video key={tour.id} src={tour.url} controls className="w-full rounded-sm" />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-sm border border-stone-300 bg-paper p-6">
          <dl className="flex flex-col gap-4 text-sm">
            <Row label={dict.project.location} value={project.location} />
            <Row label={dict.project.type} value={project.propertyType} />
            <Row
              label={dict.project.surface}
              value={project.surfaceM2 ? `${project.surfaceM2} m²` : dict.project.surfaceTbd}
            />
            <Row
              label={dict.project.budget}
              value={project.budgetLabel || dict.project.budgetTbd}
            />
            {project.startDate && (
              <Row label={dict.project.startDate} value={dateFormatter.format(project.startDate)} />
            )}
            {project.endDate ? (
              <Row label={dict.project.endDate} value={dateFormatter.format(project.endDate)} />
            ) : project.status === "IN_PROGRESS" ? (
              <Row label={dict.project.endDateEstimate} value="—" />
            ) : null}
          </dl>

          <Link
            href={`/${typedLocale}/investir?project=${project.slug}`}
            className="mt-6 block rounded-sm bg-ink px-5 py-3 text-center text-sm font-medium text-paper transition hover:bg-terracotta"
          >
            {dict.project.interestedCta}
          </Link>
        </aside>
      </div>

      <RelatedProjects
        currentId={project.id}
        locale={typedLocale}
        dict={dict}
        status={project.status}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-stone-200 pb-3">
      <dt className="text-stone-400">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

function MediaColumn({
  label,
  items,
}: {
  label: string;
  items: { id: string; url: string; caption: string | null }[];
}) {
  return (
    <div>
      <span className="text-xs font-medium uppercase tracking-wide text-terracotta">{label}</span>
      <div className="mt-2 flex flex-col gap-2">
        {items.length === 0 && (
          <div className="aspect-[4/3] rounded-sm bg-stone-200" />
        )}
        {items.map((item) => (
          <div key={item.id} className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image src={item.url} alt={item.caption ?? label} fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

async function RelatedProjects({
  currentId,
  locale,
  dict,
  status,
}: {
  currentId: string;
  locale: Locale;
  dict: ReturnType<typeof getDictionary>;
  status: "IN_PROGRESS" | "COMPLETED";
}) {
  const projects = (await getAllProjects({ status })).filter((p) => p.id !== currentId).slice(0, 3);
  if (projects.length === 0) return null;

  return (
    <div className="border-t border-stone-300 bg-stone-200/50 py-16">
      <div className="container-page">
        <h2 className="font-display text-2xl text-ink">{dict.project.otherProjects}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} dict={dict} />
          ))}
        </div>
      </div>
    </div>
  );
}
