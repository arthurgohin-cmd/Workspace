import { db } from "@/lib/db";
import type { City, ProjectStatus } from "@/generated/prisma/enums";
import type { Locale } from "@/i18n/config";

export async function getAllProjects(filters?: { status?: ProjectStatus; city?: City }) {
  return db.project.findMany({
    where: {
      status: filters?.status,
      city: filters?.city,
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { media: { orderBy: { order: "asc" } } },
  });
}

export async function getFeaturedProjects(status: ProjectStatus, take = 3) {
  return db.project.findMany({
    where: { status },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    take,
    include: { media: { orderBy: { order: "asc" } } },
  });
}

export async function getProjectBySlug(slug: string) {
  return db.project.findUnique({
    where: { slug },
    include: { media: { orderBy: { order: "asc" } } },
  });
}

export async function getProjectCounts() {
  const [total, cities] = await Promise.all([
    db.project.count(),
    db.project.findMany({ distinct: ["city"], select: { city: true } }),
  ]);
  return { total, cityCount: cities.length };
}

export function localizedSummary(
  project: { summary: string; summaryEn: string | null },
  locale: Locale
) {
  if (locale === "en") return project.summaryEn?.trim() || project.summary;
  return project.summary;
}

export function localizedDescription(
  project: { description: string; descriptionEn: string | null },
  locale: Locale
) {
  if (locale === "en") return project.descriptionEn?.trim() || project.description;
  return project.description;
}
