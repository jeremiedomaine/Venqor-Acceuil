"use client"

import { useMemo } from "react"
import { TrendingUp, Target } from "lucide-react"
import { formatEur } from "@/lib/domain-extras"

/** Ventes upsell non persistées en base — affichage honnête en attendant la V1.1. */
const REVENUE_TRACKING_ENABLED = false

export function FinanceColumn() {
  const monthLabel = useMemo(
    () =>
      new Date().toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      }),
    [],
  )

  return (
    <section className="flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <header className="flex items-center justify-between border-b border-border px-6 py-5">
        <p className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <span className="text-base font-semibold tracking-tight text-foreground">
            Revenus Upsells – Ce mois
          </span>
        </p>
        <span className="rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary ring-1 ring-primary/20">
          {monthLabel}
        </span>
      </header>

      <article className="flex flex-1 flex-col justify-between gap-6 px-6 py-6">
        <section>
          <p className="flex flex-wrap items-end gap-3">
            <span className="text-5xl font-bold tracking-tight text-muted-foreground/80">
              {REVENUE_TRACKING_ENABLED ? `+ ${formatEur(0)}` : "—"}
            </span>
            {!REVENUE_TRACKING_ENABLED ? (
              <span className="mb-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-900">
                À venir
              </span>
            ) : null}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {REVENUE_TRACKING_ENABLED
              ? "générés ce mois en upsells"
              : "Le suivi des ventes upsell sera disponible dans une prochaine version."}
          </p>

          <section className="mt-6">
            <p className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Target className="h-4 w-4" />
                <span className="text-xs font-medium">Objectif mensuel</span>
              </span>
              <span className="text-sm font-bold tracking-tight text-muted-foreground">—</span>
            </p>
            <span className="block h-2.5 w-full rounded-full bg-muted">
              <span
                className="block h-full w-0 rounded-full bg-primary/40 transition-all duration-500"
                aria-hidden
              />
            </span>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Définissez vos objectifs lorsque le suivi des revenus sera activé.
            </p>
          </section>
        </section>

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Ventes par extra ce mois
          </p>
          <div className="rounded-md border border-dashed border-border bg-muted/30 px-4 py-6 text-center">
            <p className="text-sm font-medium text-foreground">Aucune donnée de vente</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Les montants par extra s&apos;afficheront ici une fois le module de facturation upsell
              branché.
            </p>
          </div>
        </section>
      </article>
    </section>
  )
}
