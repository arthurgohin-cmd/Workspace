import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { ContactForm } from "./contact-form";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);

  return (
    <div className="container-page max-w-2xl py-20">
      <h1 className="font-display text-4xl text-ink sm:text-5xl">{dict.contact.title}</h1>
      <p className="mt-4 text-stone-400">{dict.contact.sub}</p>
      <div className="mt-12">
        <ContactForm dict={dict} />
      </div>
    </div>
  );
}
