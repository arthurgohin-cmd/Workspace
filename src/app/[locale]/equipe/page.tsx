import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { db } from "@/lib/db";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);

  const members = await db.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="container-page py-20">
      <h1 className="font-display text-4xl text-ink sm:text-5xl">{dict.team.title}</h1>
      <p className="mt-4 max-w-xl text-stone-400">{dict.team.sub}</p>

      {members.length === 0 ? (
        <p className="mt-16 text-stone-400">{dict.team.empty}</p>
      ) : (
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => {
            const bio = typedLocale === "en" ? member.bioEn?.trim() || member.bio : member.bio;
            return (
              <div key={member.id} className="flex flex-col gap-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-stone-200">
                  {member.photoUrl && (
                    <Image src={member.photoUrl} alt={member.name} fill className="object-cover" />
                  )}
                </div>
                <div>
                  <h3 className="font-display text-xl text-ink">{member.name}</h3>
                  <p className="text-sm font-medium uppercase tracking-wide text-terracotta">
                    {member.role}
                  </p>
                  {bio && <p className="mt-2 text-sm text-stone-400">{bio}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
