import type { Metadata } from "next"
import { DomainEventsRegistry } from "@/components/upstay/domain-events-registry"
import { getCurrentDomain } from "@/lib/domain/server"

export async function generateMetadata(): Promise<Metadata> {
  const domain = await getCurrentDomain()
  return {
    title: `Événements – ${domain.name}`,
    description: `Registre des événements passés et à venir — ${domain.name}.`,
  }
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
