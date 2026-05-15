import { DomainProvider } from "@/components/providers/domain-provider"
import { DomainSetupRequired } from "@/components/layout/domain-setup-required"
import { getCurrentDomain } from "@/lib/domain/server"
import { DomainError } from "@/lib/domain/types"

export async function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const domain = await getCurrentDomain()
    return <DomainProvider domain={domain}>{children}</DomainProvider>
  } catch (err) {
    if (err instanceof DomainError) {
      return <DomainSetupRequired code={err.code} message={err.message} />
    }
    throw err
  }
}
