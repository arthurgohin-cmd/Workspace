"use client";

import { useActionState, useRef } from "react";
import { createTeamMember, type TeamFormState } from "./actions";

export function TeamForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<TeamFormState, FormData>(
    async (prev, formData) => {
      const result = await createTeamMember(prev, formData);
      if (!result?.error) formRef.current?.reset();
      return result;
    },
    null
  );

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-stone-400">Nom</label>
        <input
          name="name"
          required
          className="rounded-sm border border-stone-300 bg-paper px-4 py-2.5 text-sm"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-stone-400">Rôle</label>
        <input
          name="role"
          required
          placeholder="ex. Fondateur"
          className="rounded-sm border border-stone-300 bg-paper px-4 py-2.5 text-sm"
        />
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <label className="text-xs font-medium uppercase tracking-wide text-stone-400">Bio (optionnel)</label>
        <textarea
          name="bio"
          rows={3}
          className="rounded-sm border border-stone-300 bg-paper px-4 py-2.5 text-sm"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-stone-400">Photo (optionnel)</label>
        <input type="file" name="photo" accept="image/jpeg,image/png,image/webp,image/avif" className="text-sm" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-stone-400">Ordre</label>
        <input
          name="order"
          type="number"
          defaultValue={0}
          className="rounded-sm border border-stone-300 bg-paper px-4 py-2.5 text-sm"
        />
      </div>

      {state?.error && <p className="sm:col-span-2 text-sm text-terracotta-dark">Erreur : {state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="sm:col-span-2 self-start rounded-sm bg-ink px-6 py-2.5 text-sm font-medium text-paper transition hover:bg-terracotta disabled:opacity-60"
      >
        {pending ? "Ajout…" : "Ajouter"}
      </button>
    </form>
  );
}
