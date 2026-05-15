import type { Metadata } from "next"
import { MesAppsManagement } from "@/components/upstay/mes-apps-management"
import { getCurrentDomain } from "@/lib/domain/server"

export async function generateMetadata(): Promise<Metadata> {
  const domain = await getCurrentDomain()
  return {
    title: `Mes applications – ${domain.name}`,
    description: `Sous-domaines et applications — ${domain.name}.`,
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
