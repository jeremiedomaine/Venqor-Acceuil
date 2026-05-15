import { HeroHeader } from "@/components/upstay/hero-header"
import { EventsColumn } from "@/components/upstay/events-column"
import { FinanceColumn } from "@/components/upstay/finance-column"
import { KpiBar } from "@/components/upstay/kpi-bar"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <HeroHeader />

      <div className="mx-auto max-w-screen-xl px-5 pb-16 pt-10 sm:px-8 sm:pt-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          <EventsColumn />
          <FinanceColumn />
        </div>

        <div className="mt-10 sm:mt-12">
          <KpiBar />
        </div>
      </div>
    </main>
  )
}
