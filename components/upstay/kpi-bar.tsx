"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, MessageSquare, Briefcase, Smartphone, Package } from "lucide-react"
import { MessagingSheet } from "@/components/upstay/messaging-sheet"
import { totalUnreadMessages } from "@/lib/messaging-clients"
import { countPrestatairesActifs } from "@/lib/prestataires"
import { dashboardPanelClass } from "@/components/upstay/dashboard-surface"
import { countActiveDomainApps, DOMAIN_APPS_SEED } from "@/lib/domain-apps"
import { cn } from "@/lib/utils"

/**
 * Barre KPI — chiffres pensés pour la démo (ex. domaine Lauriers).
 * Les valeurs ne reflètent pas obligatoirement les données Supabase en temps réel.
 */
const DEMO_CLIENTS = "142"

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
    value: DEMO_CLIENTS,
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
    label: "Espaces mariés",
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

  const prestatairesDemo = countPrestatairesActifs()
  const appsDemo = countActiveDomainApps(DOMAIN_APPS_SEED)

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          const cardClass = cn(
            "group",
            dashboardPanelClass(true),
            "flex flex-col gap-3.5 px-6 py-6 transition-premium hover:-translate-y-0.5",
          )

          const displayValue = kpi.openMessaging
            ? String(unreadTotal)
            : kpi.label === "Clients"
              ? DEMO_CLIENTS
              : kpi.label === "Prestataires"
                ? String(prestatairesDemo)
                : kpi.label === "Mes Apps"
                  ? String(appsDemo)
                  : kpi.value
          const showMsgBadge = kpi.openMessaging && unreadTotal > 0

          const inner = (
            <>
              <div className="relative w-fit">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${kpi.iconBg} ${kpi.iconColor} transition-transform duration-200 group-hover:scale-[1.04]`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {(kpi.badge && !kpi.openMessaging) || showMsgBadge ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full border border-white/80 bg-amber-100 px-1 text-[10px] font-semibold text-amber-900 shadow-sm shadow-amber-900/10">
                    {kpi.openMessaging ? unreadTotal : 5}
                  </span>
                ) : null}
              </div>

              <div>
                <p className="text-[1.65rem] font-semibold tabular-nums leading-none tracking-tight text-foreground">
                  {displayValue}
                </p>
                <p className="mt-2 text-xs leading-snug text-muted-foreground">{kpi.sub}</p>
              </div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {kpi.label}
              </p>
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
                      : `${kpi.label} : ${displayValue} — ouvrir les espaces mariés`
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
          className="group flex cursor-pointer flex-col items-center justify-center gap-3.5 rounded-xl border border-primary/20 bg-primary px-6 py-7 text-primary-foreground shadow-sm shadow-primary/20 transition-premium hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Ouvrir le catalogue d'extras et la configuration"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/14 text-primary-foreground transition-transform duration-200 group-hover:scale-[1.04]">
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
