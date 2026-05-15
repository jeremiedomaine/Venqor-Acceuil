import type { Metadata } from "next"
import { MesAppsManagement } from "@/components/upstay/mes-apps-management"

export const metadata: Metadata = {
  title: "Mes applications – Venqor",
  description: "Sous-domaines et applications du Domaine des lauriers de la Bastide.",
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
