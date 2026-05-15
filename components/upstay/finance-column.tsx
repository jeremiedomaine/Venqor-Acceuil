"use client"

import { useMemo } from "react"
import { TrendingUp, Camera, Tent, UtensilsCrossed, Target } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatEur } from "@/lib/domain-extras"
import { useCatalogueSync } from "@/hooks/use-catalogue-sync"

const ICONS = [Camera, Tent, UtensilsCrossed] as const

/**
 * Aperçu visuel démo — agrège les prix HT des extras visibles du catalogue
 * (pas des ventes enregistrées).
 */
export function FinanceColumn() {
  const { extras, loading } = useCatalogueSync()

  const { upsells, monthLabel, totalHt, goalHt, progress } = useMemo(() => {
    const visible = extras
      .filter((e) => e.visible)
      .sort((a, b) => b.priceEur - a.priceEur)
      .slice(0, 3)

    const total = visible.reduce((sum, e) => sum + e.priceEur, 0)
    const goal = Math.round(total / 0.82) || 1
    const pct = Math.min(100, Math.round((total / goal) * 100))

    const now = new Date()
    const monthLabel = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })

    const upsells = visible.map((item, i) => {
      const Icon = ICONS[i] ?? Camera
      const styles = [
        { color: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200/80" },
        { color: "text-sky-600", bg: "bg-sky-50", ring: "ring-sky-200/80" },
        { color: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-200/80" },
      ][i]!
      return {
        label: item.label,
        amount: formatEur(item.priceEur),
        icon: Icon,
        ...styles,
      }
    })

    return {
      upsells,
      monthLabel,
      totalHt: total,
      goalHt: goal,
      progress: pct,
    }
  }, [extras])

  const remaining = Math.max(0, goalHt - totalHt)

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
          {loading ? (
            <Skeleton className="h-14 w-40" />
          ) : (
            <>
              <p className="flex items-end gap-3">
                <span className="text-5xl font-bold tracking-tight text-primary">
                  + {formatEur(totalHt)}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Projection à partir du catalogue visible (démo)
              </p>
            </>
          )}

          <section className="mt-6">
            <p className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Target className="h-4 w-4" />
                <span className="text-xs font-medium">Objectif mensuel</span>
              </span>
              <span className="text-sm font-bold tracking-tight text-foreground">{progress}%</span>
            </p>
            <span className="block h-2.5 w-full rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </span>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {loading ? (
                <Skeleton className="inline-block h-4 w-48" />
              ) : (
                <>
                  Encore <span className="font-medium text-foreground">{formatEur(remaining)}</span> pour
                  atteindre l&apos;objectif ({formatEur(goalHt)} HT)
                </>
              )}
            </p>
          </section>
        </section>

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Top extras visibles
          </p>
          {loading ? (
            <ul className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i}>
                  <Skeleton className="h-12 w-full" />
                </li>
              ))}
            </ul>
          ) : upsells.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun extra visible dans le catalogue.</p>
          ) : (
            <ul className="space-y-3">
              {upsells.map((item) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.label}
                    className={`flex items-center justify-between rounded-md px-3 py-2.5 ring-1 ${item.bg} ${item.ring}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${item.color}`} />
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </span>
                    <span className={`text-sm font-bold tabular-nums ${item.color}`}>{item.amount}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </article>
    </section>
  )
}
