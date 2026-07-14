"use server";

import { db } from "@/lib/db";
import { InvestorSchema } from "@/lib/validation";

export type InvestorFormState = {
  success: boolean;
  error?: string;
} | null;

export async function submitInvestorInquiry(
  _prevState: InvestorFormState,
  formData: FormData
): Promise<InvestorFormState> {
  const parsed = InvestorSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    ticketRange: formData.get("ticketRange"),
    projectInterest: formData.get("projectInterest"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { success: false, error: "invalid" };
  }

  await db.investorInquiry.create({ data: parsed.data });

  return { success: true };
}
