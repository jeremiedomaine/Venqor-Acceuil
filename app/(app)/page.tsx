import { HeroHeader } from "@/components/upstay/hero-header"
import { EventsColumn } from "@/components/upstay/events-column"
import { FinanceColumn } from "@/components/upstay/finance-column"
import { KpiBar } from "@/components/upstay/kpi-bar"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <HeroHeader />

      <div className="mx-auto max-w-screen-xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <EventsColumn />
          <FinanceColumn />
        </div>

        <div className="mt-6">
          <KpiBar />
        </div>
      </div>
    </main>
  )
}
