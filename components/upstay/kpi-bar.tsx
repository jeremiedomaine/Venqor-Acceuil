"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, MessageSquare, Briefcase, Smartphone, Package } from "lucide-react"
import { MessagingSheet } from "@/components/upstay/messaging-sheet"
import { totalUnreadMessages } from "@/lib/messaging-clients"
import { countPrestatairesActifs } from "@/lib/prestataires"
import { countActiveDomainApps, loadAllDomainApps } from "@/lib/domain-apps"
import { countUniqueClients } from "@/lib/domain-events-store"
import { useDomainEventsSync } from "@/hooks/use-domain-events-sync"

const kpis: {
  label: string
  value: string
  sub: string
  icon: typeof Users
  iconColor: string
  iconBg: string
  badge: boolean | null
  href?: string
  openMessaging?: boolean
}[] = [
  {
    label: "Clients",
    value: "142",
    sub: "au total",
    icon: Users,
    iconColor: "text-muted-foreground",
    iconBg: "bg-muted",
    badge: null,
    href: "/evenements",
  },
  {
    label: "Messagerie",
    value: "5",
    sub: "non lus",
    icon: MessageSquare,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    badge: true,
    openMessaging: true,
  },
  {
    label: "Prestataires",
    value: "18",
    sub: "actifs",
    icon: Briefcase,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    badge: null,
    href: "/prestataires",
  },
  {
    label: "Mes Apps",
    value: "3",
    sub: "actives",
    icon: Smartphone,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    badge: null,
    href: "/mes-apps",
  },
]

export function KpiBar() {
  const [messagingOpen, setMessagingOpen] = useState(false)
  const unreadTotal = totalUnreadMessages()
  const [mesAppsActives, setMesAppsActives] = useState(() => countActiveDomainApps())
  const { events } = useDomainEventsSync()
  const clientCount = countUniqueClients(events)

  useEffect(() => {
    const syncApps = () => setMesAppsActives(countActiveDomainApps(loadAllDomainApps()))
    syncApps()
    window.addEventListener("focus", syncApps)
    window.addEventListener("venqor-apps-changed", syncApps)
    return () => {
      window.removeEventListener("focus", syncApps)
      window.removeEventListener("venqor-apps-changed", syncApps)
    }
  }, [])

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          const cardClass =
            "group flex flex-col gap-3 rounded-md border border-border bg-card px-5 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"

          const displayValue = kpi.openMessaging
            ? String(unreadTotal)
            : kpi.label === "Clients"
              ? String(clientCount)
              : kpi.label === "Prestataires"
                ? String(countPrestatairesActifs())
                : kpi.label === "Mes Apps"
                  ? String(mesAppsActives)
                  : kpi.value
          const showMsgBadge = kpi.openMessaging && unreadTotal > 0

          const inner = (
            <>
              <div className="relative w-fit">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-md ${kpi.iconBg} ${kpi.iconColor} transition-transform group-hover:scale-105`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {(kpi.badge && !kpi.openMessaging) || showMsgBadge ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 px-1 text-[10px] font-bold text-amber-800 ring-2 ring-card">
                    {kpi.openMessaging ? unreadTotal : 5}
                  </span>
                ) : null}
              </div>

              <div>
                <p className="text-2xl font-bold leading-none tracking-tight text-foreground">{displayValue}</p>
                <p className="mt-1 text-xs text-muted-foreground">{kpi.sub}</p>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
            </>
          )

          if (kpi.openMessaging) {
            return (
              <button
                key={kpi.label}
                type="button"
                onClick={() => setMessagingOpen(true)}
                className={`${cardClass} cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                aria-label={`Ouvrir la messagerie — ${unreadTotal} message${unreadTotal > 1 ? "s" : ""} non lu${unreadTotal > 1 ? "s" : ""}`}
              >
                {inner}
              </button>
            )
          }

          if (kpi.href) {
            return (
              <Link
                key={kpi.label}
                href={kpi.href}
                className={`${cardClass} cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                aria-label={
                  kpi.href === "/evenements"
                    ? `${kpi.label} : ${displayValue} — ouvrir le registre des événements`
                    : kpi.href === "/prestataires"
                      ? `${kpi.label} : ${displayValue} — ouvrir la gestion des prestataires`
                      : `${kpi.label} : ${displayValue} — ouvrir Mes applications`
                }
              >
                {inner}
              </Link>
            )
          }

          return (
            <div key={kpi.label} className={`${cardClass} cursor-default`}>
              {inner}
            </div>
          )
        })}

        <Link
          href="/catalogue-extras"
          className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-primary/20 bg-primary px-5 py-5 text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Ouvrir le catalogue d’extras et la configuration"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-foreground/15 text-primary-foreground transition-transform group-hover:scale-105">
            <Package className="h-5 w-5" />
          </div>
          <p className="text-center text-sm font-semibold leading-snug text-balance text-primary-foreground">
            Gérer mon catalogue d&apos;extras
          </p>
        </Link>
      </div>

      <MessagingSheet open={messagingOpen} onOpenChange={setMessagingOpen} />
    </>
  )
}
