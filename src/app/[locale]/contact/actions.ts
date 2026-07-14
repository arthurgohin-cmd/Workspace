"use server";

import { db } from "@/lib/db";
import { ContactSchema } from "@/lib/validation";

export type ContactFormState = {
  success: boolean;
  error?: string;
} | null;

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { success: false, error: "invalid" };
  }

  await db.contactInquiry.create({ data: parsed.data });

  return { success: true };
}
