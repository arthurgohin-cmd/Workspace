import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminDashboard() {
  const [projectCount, inProgressCount, teamCount, contactCount, investorCount] =
    await Promise.all([
      db.project.count(),
      db.project.count({ where: { status: "IN_PROGRESS" } }),
      db.teamMember.count(),
      db.contactInquiry.count({ where: { handled: false } }),
      db.investorInquiry.count({ where: { handled: false } }),
    ]);

  const stats = [
    { label: "Projets", value: projectCount, href: "/admin/projects" },
    { label: "En cours de rénovation", value: inProgressCount, href: "/admin/projects" },
    { label: "Membres d'équipe", value: teamCount, href: "/admin/team" },
    {
      label: "Messages non traités",
      value: contactCount + investorCount,
      href: "/admin/inquiries",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Tableau de bord</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-sm border border-stone-300 bg-paper p-6 transition hover:border-terracotta"
          >
            <span className="font-display text-3xl text-terracotta">{stat.value}</span>
            <p className="mt-2 text-sm text-stone-400">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
