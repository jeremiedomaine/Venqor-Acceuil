import type { Metadata } from "next"
import { DomainEventsRegistry } from "@/components/upstay/domain-events-registry"

export const metadata: Metadata = {
  title: "Événements du domaine – Venqor",
  description:
    "Registre des événements passés et à venir — Domaine des lauriers de la Bastide.",
}

export default function EvenementsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-screen-xl px-6 py-8">
        <DomainEventsRegistry />
      </main>
    </div>
  )
}
