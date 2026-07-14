"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, null);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-stone-400">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="rounded-sm border border-stone-300 bg-paper px-4 py-3 text-ink outline-none focus:border-terracotta"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-xs font-medium uppercase tracking-wide text-stone-400"
        >
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-sm border border-stone-300 bg-paper px-4 py-3 text-ink outline-none focus:border-terracotta"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-terracotta-dark">Identifiants incorrects.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-ink px-7 py-3.5 text-sm font-medium text-paper transition hover:bg-terracotta disabled:opacity-60"
      >
        {pending ? "…" : "Se connecter"}
      </button>
    </form>
  );
}
