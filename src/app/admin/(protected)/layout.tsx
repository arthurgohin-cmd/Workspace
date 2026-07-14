import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { LogoutButton } from "./logout-button";

const NAV = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/projects", label: "Projets" },
  { href: "/admin/team", label: "Équipe" },
  { href: "/admin/inquiries", label: "Messages" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  return (
    <div className="flex min-h-screen bg-stone-100">
      <aside className="flex w-60 flex-none flex-col justify-between bg-ink px-5 py-8 text-paper">
        <div>
          <Link href="/admin" className="font-display text-lg tracking-wide">
            CARVER<span className="text-terracotta-light"> INVEST</span>
          </Link>
          <nav className="mt-10 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-sm px-3 py-2 text-sm font-medium text-paper/75 transition hover:bg-paper/10 hover:text-paper"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-2 text-xs text-paper/50">
          <span>{session.email}</span>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
