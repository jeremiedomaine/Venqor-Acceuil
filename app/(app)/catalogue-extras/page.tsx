import type { Metadata } from "next"
import { CatalogueExtrasManagement } from "@/components/upstay/catalogue-extras-management"
import { getCurrentDomain } from "@/lib/domain/server"

export async function generateMetadata(): Promise<Metadata> {
  const domain = await getCurrentDomain()
  return {
    title: `Catalogue d'extras – ${domain.name}`,
    description: `Extras et configuration du catalogue — ${domain.name}.`,
  }
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
