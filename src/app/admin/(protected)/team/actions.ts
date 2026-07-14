"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { TeamMemberFormSchema } from "@/lib/validation";
import { translateToEnglish } from "@/lib/translate";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/storage";

export type TeamFormState = { error?: string } | null;

export async function createTeamMember(
  _prevState: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  await verifySession();

  const parsed = TeamMemberFormSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    order: formData.get("order"),
  });
  if (!parsed.success) {
    return { error: "invalid" };
  }

  let photoUrl: string | null = null;
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    try {
      photoUrl = await saveUploadedFile(file, "team");
    } catch (err) {
      return { error: err instanceof Error ? err.message : "upload-failed" };
    }
  }

  const bioEn = parsed.data.bio ? await translateToEnglish(parsed.data.bio) : null;

  await db.teamMember.create({
    data: {
      name: parsed.data.name,
      role: parsed.data.role,
      bio: parsed.data.bio || null,
      bioEn,
      photoUrl,
      order: parsed.data.order ? Number(parsed.data.order) : 0,
    },
  });

  revalidatePath("/admin/team");
  revalidatePath("/[locale]/equipe", "page");
  return { error: undefined };
}

export async function deleteTeamMember(id: string) {
  await verifySession();

  const member = await db.teamMember.findUnique({ where: { id } });
  if (member?.photoUrl) await deleteUploadedFile(member.photoUrl);
  await db.teamMember.delete({ where: { id } });

  revalidatePath("/admin/team");
  revalidatePath("/[locale]/equipe", "page");
}
