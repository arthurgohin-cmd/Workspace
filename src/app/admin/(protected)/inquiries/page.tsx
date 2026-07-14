import { db } from "@/lib/db";
import { toggleContactHandled, toggleInvestorHandled } from "./actions";

export default async function AdminInquiriesPage() {
  const [contacts, investors] = await Promise.all([
    db.contactInquiry.findMany({ orderBy: { createdAt: "desc" } }),
    db.investorInquiry.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl text-ink">Messages</h1>

      <section className="mt-8">
        <h2 className="font-display text-xl text-ink">Investisseurs</h2>
        <div className="mt-4 flex flex-col gap-3">
          {investors.length === 0 && <p className="text-sm text-stone-400">Aucun message.</p>}
          {investors.map((inq) => (
            <div
              key={inq.id}
              className={`rounded-sm border p-4 text-sm ${
                inq.handled ? "border-stone-200 bg-stone-100/60 text-stone-400" : "border-stone-300 bg-paper"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-ink">
                  {inq.name} — {inq.email}
                </span>
                <form action={toggleInvestorHandled.bind(null, inq.id, inq.handled)}>
                  <button type="submit" className="text-xs text-terracotta hover:underline">
                    {inq.handled ? "Rouvrir" : "Marquer traité"}
                  </button>
                </form>
              </div>
              <div className="mt-1 text-xs text-stone-400">
                {inq.phone && <span>{inq.phone} · </span>}
                {inq.ticketRange && <span>{inq.ticketRange} · </span>}
                {inq.projectInterest && <span>Projet : {inq.projectInterest} · </span>}
                {inq.createdAt.toLocaleDateString("fr-FR")}
              </div>
              <p className="mt-2">{inq.message}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl text-ink">Contact général</h2>
        <div className="mt-4 flex flex-col gap-3">
          {contacts.length === 0 && <p className="text-sm text-stone-400">Aucun message.</p>}
          {contacts.map((inq) => (
            <div
              key={inq.id}
              className={`rounded-sm border p-4 text-sm ${
                inq.handled ? "border-stone-200 bg-stone-100/60 text-stone-400" : "border-stone-300 bg-paper"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-ink">
                  {inq.name} — {inq.email}
                </span>
                <form action={toggleContactHandled.bind(null, inq.id, inq.handled)}>
                  <button type="submit" className="text-xs text-terracotta hover:underline">
                    {inq.handled ? "Rouvrir" : "Marquer traité"}
                  </button>
                </form>
              </div>
              <div className="mt-1 text-xs text-stone-400">
                {inq.phone && <span>{inq.phone} · </span>}
                {inq.createdAt.toLocaleDateString("fr-FR")}
              </div>
              <p className="mt-2">{inq.message}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
