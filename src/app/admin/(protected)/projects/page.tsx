import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { media: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Projets</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-terracotta"
        >
          + Nouveau projet
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-sm border border-stone-300 bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-300 bg-stone-100 text-xs uppercase tracking-wide text-stone-400">
            <tr>
              <th className="px-5 py-3">Titre</th>
              <th className="px-5 py-3">Ville</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3">Médias</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-stone-200 last:border-none">
                <td className="px-5 py-3 font-medium text-ink">{project.title}</td>
                <td className="px-5 py-3 text-stone-400">{project.city}</td>
                <td className="px-5 py-3 text-stone-400">
                  {project.status === "IN_PROGRESS" ? "En cours" : "Terminé"}
                </td>
                <td className="px-5 py-3 text-stone-400">{project._count.media}</td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="text-terracotta hover:underline"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
