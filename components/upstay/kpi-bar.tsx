"use client"

import Link from "next/link"
import { Users, Briefcase, Smartphone, Package, CalendarDays } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { countPrestatairesActifs } from "@/lib/prestataires"
import { countActiveDomainApps } from "@/lib/domain-apps"
import { countUniqueClients, countUpcomingEvents } from "@/lib/dashboard-stats"
import { useDomainEventsSync } from "@/hooks/use-domain-events-sync"
import { usePrestatairesSync } from "@/hooks/use-prestataires-sync"
import { useDomainAppsSync } from "@/hooks/use-domain-apps-sync"

const cardClass =
  "group flex flex-col gap-3 rounded-md border border-border bg-card px-5 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"

function KpiValue({ loading, value }: { loading: boolean; value: number }) {
  if (loading) return <Skeleton className="h-8 w-12" />
  return (
    <p className="text-2xl font-bold leading-none tracking-tight text-foreground tabular-nums">
      {value}
    </p>
  )
}

export function KpiBar() {
  const { events, loading: eventsLoading } = useDomainEventsSync()
  const { prestataires, loading: prestatairesLoading } = usePrestatairesSync()
  const { apps, loading: appsLoading } = useDomainAppsSync()

  const clientCount = countUniqueClients(events)
  const upcomingCount = countUpcomingEvents(events)
  const prestatairesActifs = countPrestatairesActifs(prestataires)
  const mesAppsActives = countActiveDomainApps(apps)

  const kpis = [
    {
      label: "Clients",
      sub: "au total",
      value: clientCount,
      loading: eventsLoading,
      icon: Users,
      iconColor: "text-muted-foreground",
      iconBg: "bg-muted",
      href: "/evenements",
      ariaLabel: `Clients : ${clientCount} — ouvrir le registre des événements`,
    },
    {
      label: "Événements",
      sub: "à venir ou en cours",
      value: upcomingCount,
      loading: eventsLoading,
      icon: CalendarDays,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      href: "/evenements",
      ariaLabel: `Événements à venir : ${upcomingCount} — ouvrir le registre`,
    },
    {
      label: "Prestataires",
      sub: "actifs",
      value: prestatairesActifs,
      loading: prestatairesLoading,
      icon: Briefcase,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      href: "/prestataires",
      ariaLabel: `Prestataires actifs : ${prestatairesActifs} — ouvrir la gestion`,
    },
    {
      label: "Mes Apps",
      sub: "actives",
      value: mesAppsActives,
      loading: appsLoading,
      icon: Smartphone,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      href: "/mes-apps",
      ariaLabel: `Applications actives : ${mesAppsActives} — ouvrir Mes applications`,
    },
  ] as const

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Link
            key={kpi.label}
            href={kpi.href}
            className={`${cardClass} cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
            aria-label={kpi.ariaLabel}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-md ${kpi.iconBg} transition-transform group-hover:scale-105`}
            >
              <Icon className={`h-5 w-5 ${kpi.iconColor}`} />
            </div>
            <div>
              <KpiValue loading={kpi.loading} value={kpi.value} />
              <p className="mt-1 text-xs text-muted-foreground">{kpi.sub}</p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {kpi.label}
            </p>
          </Link>
        )
      })}

      <Link
        href="/catalogue-extras"
        className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-primary/20 bg-primary px-5 py-5 text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Ouvrir le catalogue d'extras et la configuration"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-foreground/15 text-primary-foreground transition-transform group-hover:scale-105">
          <Package className="h-5 w-5" />
        </div>
        <p className="text-center text-sm font-semibold leading-snug text-balance text-primary-foreground">
          Gérer mon catalogue d&apos;extras
        </p>
      </Link>
    </div>
  )
}
