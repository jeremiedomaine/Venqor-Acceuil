import type { Metadata } from "next"
import { CatalogueExtrasManagement } from "@/components/upstay/catalogue-extras-management"

export const metadata: Metadata = {
  title: "Catalogue d’extras – Venqor",
  description: "Extras et configuration du catalogue — Domaine des lauriers de la Bastide.",
}

export default function CatalogueExtrasPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-screen-xl px-6 py-8">
        <CatalogueExtrasManagement />
      </main>
    </div>
  )
}
