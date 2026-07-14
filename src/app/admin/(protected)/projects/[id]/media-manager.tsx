"use client";

import { useActionState, useRef } from "react";
import Image from "next/image";
import {
  uploadMedia,
  deleteMedia,
  type MediaUploadState,
} from "../actions";
import type { Media } from "@/generated/prisma/client";

const TYPES = [
  { value: "PHOTO", label: "Photo" },
  { value: "VIDEO", label: "Vidéo" },
  { value: "TOUR_3D", label: "Vidéo / visite 3D" },
];

const PHASES = [
  { value: "GENERAL", label: "Général" },
  { value: "BEFORE", label: "Avant travaux" },
  { value: "AFTER", label: "Après travaux" },
];

export function MediaManager({ projectId, media }: { projectId: string; media: Media[] }) {
  const uploadAction = uploadMedia.bind(null, projectId);
  const [state, formAction, pending] = useActionState<MediaUploadState, FormData>(
    uploadAction,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-6">
      {media.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-sm border border-stone-300 bg-paper">
              <div className="relative aspect-video bg-stone-200">
                {item.type === "PHOTO" ? (
                  <Image src={item.url} alt={item.caption ?? ""} fill className="object-cover" />
                ) : (
                  <video src={item.url} className="h-full w-full object-cover" muted />
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-3 text-xs">
                <span className="text-stone-400">
                  {TYPES.find((t) => t.value === item.type)?.label} ·{" "}
                  {PHASES.find((p) => p.value === item.phase)?.label}
                </span>
                <form action={deleteMedia.bind(null, item.id, projectId)}>
                  <button type="submit" className="text-terracotta-dark hover:underline">
                    Supprimer
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        ref={formRef}
        action={async (formData) => {
          await formAction(formData);
          formRef.current?.reset();
        }}
        className="grid gap-4 rounded-sm border border-dashed border-stone-300 p-5 sm:grid-cols-4"
      >
        <div className="sm:col-span-4">
          <label className="text-xs font-medium uppercase tracking-wide text-stone-400">
            Fichier (image ou vidéo)
          </label>
          <input
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
            required
            className="mt-2 block w-full text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-stone-400">Type</label>
          <select name="type" defaultValue="PHOTO" className="mt-2 w-full rounded-sm border border-stone-300 bg-paper px-3 py-2 text-sm">
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-stone-400">Phase</label>
          <select name="phase" defaultValue="GENERAL" className="mt-2 w-full rounded-sm border border-stone-300 bg-paper px-3 py-2 text-sm">
            {PHASES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wide text-stone-400">
            Légende (optionnel)
          </label>
          <input
            type="text"
            name="caption"
            className="mt-2 w-full rounded-sm border border-stone-300 bg-paper px-3 py-2 text-sm"
          />
        </div>

        {state?.error && (
          <p className="sm:col-span-4 text-sm text-terracotta-dark">
            Échec de l&apos;envoi : {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="sm:col-span-4 self-start rounded-sm bg-ink px-6 py-2.5 text-sm font-medium text-paper transition hover:bg-terracotta disabled:opacity-60"
        >
          {pending ? "Envoi…" : "Ajouter le média"}
        </button>
      </form>
    </div>
  );
}
