import Image from "next/image";
import { db } from "@/lib/db";
import { TeamForm } from "./team-form";
import { deleteTeamMember } from "./actions";

export default async function AdminTeamPage() {
  const members = await db.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-ink">Équipe</h1>

      <div className="mt-8 rounded-sm border border-stone-300 bg-paper p-6">
        <TeamForm />
      </div>

      {members.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 rounded-sm border border-stone-300 bg-paper p-4"
            >
              <div className="relative h-14 w-14 flex-none overflow-hidden rounded-full bg-stone-200">
                {member.photoUrl && (
                  <Image src={member.photoUrl} alt={member.name} fill className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-ink">{member.name}</p>
                <p className="text-xs text-stone-400">{member.role}</p>
              </div>
              <form action={deleteTeamMember.bind(null, member.id)}>
                <button type="submit" className="text-xs text-terracotta-dark hover:underline">
                  Supprimer
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
