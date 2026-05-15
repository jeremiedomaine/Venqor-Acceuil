import type { Metadata } from "next"
import { PrestatairesManagement } from "@/components/upstay/prestataires-management"
import { getCurrentDomain } from "@/lib/domain/server"

export async function generateMetadata(): Promise<Metadata> {
  const domain = await getCurrentDomain()
  return {
    title: `Prestataires – ${domain.name}`,
    description: `Gestion des prestataires — ${domain.name}.`,
  }
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
