import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { db } from "@/lib/db";
import { InvestorForm } from "./investor-form";

export default async function InvestPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ project?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);
  const { project } = await searchParams;

  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
    select: { slug: true, title: true },
  });

  return (
    <div className="container-page grid gap-16 py-20 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-terracotta">
          {dict.invest.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">{dict.invest.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink/80">{dict.invest.intro}</p>
        <p className="mt-4 text-stone-400">{dict.invest.body1}</p>
        <p className="mt-4 text-stone-400">{dict.invest.body2}</p>
      </div>

      <div className="rounded-sm border border-stone-300 bg-paper p-8">
        <h2 className="font-display text-2xl text-ink">{dict.invest.formTitle}</h2>
        <div className="mt-6">
          <InvestorForm dict={dict} projects={projects} defaultProjectSlug={project} />
        </div>
      </div>
    </div>
  );
}
