"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { ProjectFormSchema } from "@/lib/validation";
import { slugify } from "@/lib/slugify";
import { translateToEnglish } from "@/lib/translate";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/storage";
import type { MediaPhase, MediaType } from "@/generated/prisma/enums";

export type ProjectFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

function parseProjectFields(formData: FormData) {
  const parsed = ProjectFormSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    city: formData.get("city"),
    location: formData.get("location"),
    status: formData.get("status"),
    propertyType: formData.get("propertyType"),
    surfaceM2: formData.get("surfaceM2"),
    budgetLabel: formData.get("budgetLabel"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    featured: formData.get("featured"),
    order: formData.get("order"),
  });
  return parsed;
}

async function buildData(parsed: z.infer<typeof ProjectFormSchema>) {
  const [summaryEn, descriptionEn] = await Promise.all([
    translateToEnglish(parsed.summary),
    translateToEnglish(parsed.description ?? ""),
  ]);

  return {
    title: parsed.title,
    slug: (parsed.slug || slugify(parsed.title)).slice(0, 80),
    city: parsed.city,
    location: parsed.location,
    status: parsed.status,
    propertyType: parsed.propertyType,
    surfaceM2: parsed.surfaceM2 ? Number(parsed.surfaceM2) : null,
    budgetLabel: parsed.budgetLabel || null,
    summary: parsed.summary,
    summaryEn,
    description: parsed.description ?? "",
    descriptionEn,
    startDate: parsed.startDate ? new Date(parsed.startDate) : null,
    endDate: parsed.endDate ? new Date(parsed.endDate) : null,
    featured: parsed.featured === "on",
    order: parsed.order ? Number(parsed.order) : 0,
  };
}

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await verifySession();

  const parsed = parseProjectFields(formData);
  if (!parsed.success) {
    return { error: "invalid", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = await buildData(parsed.data);

  const project = await db.project.create({ data });

  revalidatePath("/admin/projects");
  revalidatePath("/[locale]", "layout");
  redirect(`/admin/projects/${project.id}`);
}

export async function updateProject(
  id: string,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await verifySession();

  const parsed = parseProjectFields(formData);
  if (!parsed.success) {
    return { error: "invalid", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = await buildData(parsed.data);

  await db.project.update({ where: { id }, data });

  revalidatePath("/admin/projects");
  revalidatePath("/[locale]", "layout");
  return { error: undefined };
}

export async function deleteProject(id: string) {
  await verifySession();

  const project = await db.project.findUnique({ where: { id }, include: { media: true } });
  if (!project) redirect("/admin/projects");

  await Promise.all(project.media.map((m) => deleteUploadedFile(m.url)));
  await db.project.delete({ where: { id } });

  revalidatePath("/admin/projects");
  revalidatePath("/[locale]", "layout");
  redirect("/admin/projects");
}

export type MediaUploadState = { error?: string } | null;

export async function uploadMedia(
  projectId: string,
  _prevState: MediaUploadState,
  formData: FormData
): Promise<MediaUploadState> {
  await verifySession();

  const file = formData.get("file");
  const type = formData.get("type") as MediaType | null;
  const phase = (formData.get("phase") as MediaPhase | null) ?? "GENERAL";
  const caption = (formData.get("caption") as string | null) ?? null;

  if (!(file instanceof File) || file.size === 0) {
    return { error: "no-file" };
  }
  if (!type) {
    return { error: "no-type" };
  }

  try {
    const url = await saveUploadedFile(file, projectId);
    const count = await db.media.count({ where: { projectId } });
    await db.media.create({
      data: { projectId, type, phase, caption: caption || null, url, order: count },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "upload-failed" };
  }

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/[locale]", "layout");
  return { error: undefined };
}

export async function deleteMedia(mediaId: string, projectId: string) {
  await verifySession();

  const media = await db.media.findUnique({ where: { id: mediaId } });
  if (media) {
    await deleteUploadedFile(media.url);
    await db.media.delete({ where: { id: mediaId } });
  }

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/[locale]", "layout");
}
