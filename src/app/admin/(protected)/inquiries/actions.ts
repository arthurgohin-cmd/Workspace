"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";

export async function toggleContactHandled(id: string, handled: boolean) {
  await verifySession();
  await db.contactInquiry.update({ where: { id }, data: { handled: !handled } });
  revalidatePath("/admin/inquiries");
}

export async function toggleInvestorHandled(id: string, handled: boolean) {
  await verifySession();
  await db.investorInquiry.update({ where: { id }, data: { handled: !handled } });
  revalidatePath("/admin/inquiries");
}
