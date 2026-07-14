import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { localizedSummary } from "@/lib/projects";
import { StatusPill } from "@/components/status-pill";
import { MediaPlaceholder } from "@/components/media-placeholder";
import type { Media, Project } from "@/generated/prisma/client";

export function ProjectCard({
  project,
  locale,
  dict,
}: {
  project: Project & { media: Media[] };
  locale: Locale;
  dict: Dictionary;
}) {
  const cover = project.media.find((m) => m.type === "PHOTO" && m.phase !== "BEFORE");

  return (
    <Link
      href={`/${locale}/projets/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-stone-300/70 bg-paper transition hover:border-terracotta/50 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.caption ?? project.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <MediaPlaceholder seed={project.slug} />
        )}
        <div className="absolute left-3 top-3">
          <StatusPill status={project.status} dict={dict} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-terracotta">
          {dict.cities[project.city]} — {project.location}
        </span>
        <h3 className="font-display text-xl text-ink">{project.title}</h3>
        <p className="line-clamp-2 text-sm text-stone-400">
          {localizedSummary(project, locale)}
        </p>
      </div>
    </Link>
  );
}
