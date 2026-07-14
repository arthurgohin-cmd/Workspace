"use client";

import { useActionState } from "react";
import { submitInvestorInquiry, type InvestorFormState } from "./actions";
import type { Dictionary } from "@/i18n/get-dictionary";

export function InvestorForm({
  dict,
  projects,
  defaultProjectSlug,
}: {
  dict: Dictionary;
  projects: { slug: string; title: string }[];
  defaultProjectSlug?: string;
}) {
  const [state, action, pending] = useActionState<InvestorFormState, FormData>(
    submitInvestorInquiry,
    null
  );

  if (state?.success) {
    return (
      <p className="rounded-sm border border-sage/40 bg-sage/10 px-5 py-4 text-sage">
        {dict.invest.success}
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={dict.invest.formName} name="name" required />
        <Field label={dict.invest.formEmail} name="email" type="email" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={dict.invest.formPhone} name="phone" type="tel" />
        <Field
          label={dict.invest.formTicket}
          name="ticketRange"
          placeholder={dict.invest.formTicketPlaceholder}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="projectInterest"
          className="text-xs font-medium uppercase tracking-wide text-stone-400"
        >
          {dict.invest.formProject}
        </label>
        <select
          id="projectInterest"
          name="projectInterest"
          defaultValue={defaultProjectSlug ?? ""}
          className="rounded-sm border border-stone-300 bg-paper px-4 py-3 text-ink outline-none focus:border-terracotta"
        >
          <option value="">{dict.invest.formProjectNone}</option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-xs font-medium uppercase tracking-wide text-stone-400">
          {dict.invest.formMessage}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="rounded-sm border border-stone-300 bg-paper px-4 py-3 text-ink outline-none focus:border-terracotta"
        />
      </div>

      {state?.error && <p className="text-sm text-terracotta-dark">{dict.invest.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-terracotta px-7 py-3.5 text-sm font-medium text-paper transition hover:bg-terracotta-dark disabled:opacity-60"
      >
        {pending ? "…" : dict.invest.formSubmit}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
        placeholder={placeholder}
        className="rounded-sm border border-stone-300 bg-paper px-4 py-3 text-ink outline-none focus:border-terracotta"
      />
    </div>
  );
}
