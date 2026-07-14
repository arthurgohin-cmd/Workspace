import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProjectForm } from "../project-form";
import { updateProject, deleteProject } from "../actions";
import { MediaManager } from "./media-manager";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await db.project.findUnique({
    where: { id },
    include: { media: { orderBy: { order: "asc" } } },
  });
  if (!project) notFound();

  const boundUpdate = updateProject.bind(null, id);
  const boundDelete = deleteProject.bind(null, id);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">{project.title}</h1>
        <form action={boundDelete}>
          <button type="submit" className="text-sm text-terracotta-dark hover:underline">
            Supprimer ce projet
          </button>
        </form>
      </div>

      <div className="mt-8">
        <ProjectForm action={boundUpdate} project={project} />
      </div>

      <div className="mt-12">
        <h2 className="font-display text-2xl text-ink">Médias</h2>
        <div className="mt-5">
          <MediaManager projectId={project.id} media={project.media} />
        </div>
      </div>
    </div>
  );
}
