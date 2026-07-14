"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export type LoginState = { error?: string } | null;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "missing" };
  }

  const admin = await db.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return { error: "invalid" };
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return { error: "invalid" };
  }

  await createSession(admin.id, admin.email);
  redirect("/admin");
}
