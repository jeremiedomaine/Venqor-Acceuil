import type { Metadata } from "next"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { getCurrentDomain } from "@/lib/domain/server"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const domain = await getCurrentDomain()
    return {
      title: `Venqor – ${domain.name}`,
      description: `Tableau de bord B2B Venqor : événements, upsells et prestataires — ${domain.name}.`,
    }
  } catch {
    return {
      title: "Venqor",
      description: "Tableau de bord B2B Venqor.",
    }
  }
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell>{children}</DashboardShell>
}
