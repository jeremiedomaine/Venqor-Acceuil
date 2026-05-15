import type { Metadata } from "next"
import { PrestatairesManagement } from "@/components/upstay/prestataires-management"

export const metadata: Metadata = {
  title: "Prestataires du domaine – Venqor",
  description: "Gestion des prestataires — Domaine des lauriers de la Bastide.",
}

export default function PrestatairesPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-screen-xl px-6 py-8">
        <PrestatairesManagement />
      </main>
    </div>
  )
}
