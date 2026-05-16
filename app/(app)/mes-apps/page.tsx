import type { Metadata } from "next"
import { MesAppsManagement } from "@/components/upstay/mes-apps-management"
import { getCurrentDomain } from "@/lib/domain/server"

export async function generateMetadata(): Promise<Metadata> {
  const domain = await getCurrentDomain()
  return {
    title: `Espaces mariés – ${domain.name}`,
    description: `Mini-apps personnalisées par mariage — ${domain.name}.`,
  }
}

export default function MesAppsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-screen-xl px-6 py-8">
        <MesAppsManagement />
      </main>
    </div>
  )
}
