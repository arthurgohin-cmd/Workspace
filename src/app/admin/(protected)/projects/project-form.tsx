"use client";

import { useActionState } from "react";
import type { ProjectFormState } from "./actions";
import type { Project } from "@/generated/prisma/client";

const CITIES = [
  { value: "PARIS", label: "Paris" },
  { value: "CANNES", label: "Cannes & Côte d'Azur" },
  { value: "MIAMI", label: "Miami" },
];

const STATUSES = [
  { value: "IN_PROGRESS", label: "En cours de rénovation" },
  { value: "COMPLETED", label: "Terminé" },
];

function toDateInput(date: Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function ProjectForm({
  action,
  project,
}: {
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  project?: Project;
}) {
  const [state, formAction, pending] = useActionState<ProjectFormState, FormData>(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Titre" name="title" defaultValue={project?.title} required />
        <Field
          label="Slug (URL, optionnel)"
          name="slug"
          defaultValue={project?.slug}
          placeholder="auto-généré depuis le titre"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <SelectField label="Ville" name="city" defaultValue={project?.city ?? "PARIS"} options={CITIES} />
        <Field
          label="Localisation précise"
          name="location"
          defaultValue={project?.location}
          required
        />
        <SelectField
          label="Statut"
          name="status"
          defaultValue={project?.status ?? "IN_PROGRESS"}
          options={STATUSES}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Typologie" name="propertyType" defaultValue={project?.propertyType ?? "Villa"} required />
        <Field
          label="Surface (m², optionnel)"
          name="surfaceM2"
          type="number"
          defaultValue={project?.surfaceM2 ?? undefined}
        />
        <Field
          label="Montant de l'opération (texte libre)"
          name="budgetLabel"
          defaultValue={project?.budgetLabel ?? ""}
          placeholder="ex. Sur demande"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Début des travaux"
          name="startDate"
          type="date"
          defaultValue={toDateInput(project?.startDate)}
        />
        <Field
          label="Livraison"
          name="endDate"
          type="date"
          defaultValue={toDateInput(project?.endDate)}
        />
      </div>

      <TextAreaField
        label="Résumé court (affiché dans les listes)"
        name="summary"
        defaultValue={project?.summary}
        rows={2}
        required
      />
      <TextAreaField
        label="Description complète"
        name="description"
        defaultValue={project?.description}
        rows={6}
      />
      <p className="-mt-4 text-xs text-stone-400">
        La traduction anglaise est générée automatiquement à l&apos;enregistrement.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Ordre d'affichage" name="order" type="number" defaultValue={project?.order ?? 0} />
        <label className="flex items-center gap-2 self-end pb-3 text-sm text-ink">
          <input type="checkbox" name="featured" defaultChecked={project?.featured} />
          Mettre en avant sur la page d&apos;accueil
        </label>
      </div>

      {state?.error && (
        <p className="text-sm text-terracotta-dark">
          Merci de vérifier les champs du formulaire.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-ink px-7 py-3 text-sm font-medium text-paper transition hover:bg-terracotta disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
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
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="rounded-sm border border-stone-300 bg-paper px-4 py-2.5 text-ink outline-none focus:border-terracotta"
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  rows,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows: number;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-xs font-medium uppercase tracking-wide text-stone-400">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        required={required}
        className="rounded-sm border border-stone-300 bg-paper px-4 py-2.5 text-ink outline-none focus:border-terracotta"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-xs font-medium uppercase tracking-wide text-stone-400">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="rounded-sm border border-stone-300 bg-paper px-4 py-2.5 text-ink outline-none focus:border-terracotta"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
