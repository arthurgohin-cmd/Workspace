import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);

  const steps = [
    { title: dict.about.step1Title, text: dict.about.step1Text },
    { title: dict.about.step2Title, text: dict.about.step2Text },
    { title: dict.about.step3Title, text: dict.about.step3Text },
    { title: dict.about.step4Title, text: dict.about.step4Text },
  ];

  return (
    <div>
      <section className="container-page py-20">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-terracotta">
          {dict.about.eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl text-ink sm:text-5xl">
          {dict.about.intro}
        </h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <p className="text-lg leading-relaxed text-ink/80">{dict.about.body1}</p>
          <p className="text-lg leading-relaxed text-ink/80">{dict.about.body2}</p>
        </div>
      </section>

      <section className="bg-stone-200/50 py-20">
        <div className="container-page">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">{dict.about.methodTitle}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="border-t border-stone-300 pt-5">
                <span className="font-display text-2xl text-terracotta">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-medium text-ink">{step.title}</h3>
                <p className="mt-2 text-sm text-stone-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page flex flex-col items-start gap-5 py-20">
        <Link
          href={`/${typedLocale}/equipe`}
          className="rounded-sm bg-ink px-7 py-3.5 text-sm font-medium text-paper transition hover:bg-terracotta"
        >
          {dict.about.teamCta}
        </Link>
      </section>
    </div>
  );
}
