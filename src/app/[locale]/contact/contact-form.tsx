"use client";

import { useActionState } from "react";
import { submitContact, type ContactFormState } from "./actions";
import type { Dictionary } from "@/i18n/get-dictionary";

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [state, action, pending] = useActionState<ContactFormState, FormData>(
    submitContact,
    null
  );

  if (state?.success) {
    return (
      <p className="rounded-sm border border-sage/40 bg-sage/10 px-5 py-4 text-sage">
        {dict.contact.success}
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={dict.contact.formName} name="name" required />
        <Field label={dict.contact.formEmail} name="email" type="email" required />
      </div>
      <Field label={dict.contact.formPhone} name="phone" type="tel" />
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-xs font-medium uppercase tracking-wide text-stone-400">
          {dict.contact.formMessage}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="rounded-sm border border-stone-300 bg-paper px-4 py-3 text-ink outline-none focus:border-terracotta"
        />
      </div>

      {state?.error && <p className="text-sm text-terracotta-dark">{dict.contact.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-ink px-7 py-3.5 text-sm font-medium text-paper transition hover:bg-terracotta disabled:opacity-60"
      >
        {pending ? "…" : dict.contact.formSubmit}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-xs font-medium uppercase tracking-wide text-stone-400">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="rounded-sm border border-stone-300 bg-paper px-4 py-3 text-ink outline-none focus:border-terracotta"
      />
    </div>
  );
}
