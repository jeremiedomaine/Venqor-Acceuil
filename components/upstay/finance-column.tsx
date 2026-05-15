"use client"

import { useMemo } from "react"
import Link from "next/link"
import { TrendingUp, Camera, Tent, UtensilsCrossed, Target, Sparkles } from "lucide-react"
import { DashboardSurface } from "@/components/upstay/dashboard-surface"
import { EmptyState } from "@/components/upstay/empty-state"
import { Button } from "@/components/ui/button"
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
        { color: "text-amber-700", bg: "bg-amber-50/90", ring: "ring-amber-200/55" },
        { color: "text-sky-700", bg: "bg-sky-50/90", ring: "ring-sky-200/55" },
        { color: "text-emerald-800", bg: "bg-emerald-50/90", ring: "ring-emerald-200/55" },
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
  const hasVisibleUpsells = upsells.length > 0

  return (
    <DashboardSurface className="flex flex-col">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 px-7 py-6">
        <div>
          <p className="flex items-center gap-2.5 text-muted-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-base font-semibold tracking-tight text-foreground">
              Revenus upsells — ce mois
            </span>
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Projection indicative à partir des tarifs catalogue visibles (démo).
          </p>
        </div>
        <span className="rounded-full border border-primary/15 bg-primary/6 px-3.5 py-1.5 text-xs font-medium capitalize text-primary">
          {monthLabel}
        </span>
      </header>

      <article className="flex flex-1 flex-col justify-between gap-8 px-7 py-7">
        <section>
          {loading ? (
            <Skeleton className="h-16 w-48 rounded-lg" />
          ) : !hasVisibleUpsells ? (
            <EmptyState
              icon={Sparkles}
              title="Rien à afficher pour l’instant"
              description="Dès que des extras sont visibles dans votre catalogue, une projection mensuelle s’affichera ici pour vous aider à anticiper le potentiel."
              className="py-10"
            >
              <Button className="rounded-lg shadow-sm shadow-primary/10 transition-premium" asChild>
                <Link href="/catalogue-extras">Ouvrir le catalogue</Link>
              </Button>
            </EmptyState>
          ) : (
            <>
              <p className="flex flex-wrap items-baseline gap-2">
                <span className="text-5xl font-semibold tabular-nums tracking-tight text-primary sm:text-[3.25rem]">
                  +{formatEur(totalHt)}
                </span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Somme HT des trois extras visibles les plus chers — à titre d’indication.
              </p>

              <section className="mt-8">
                <p className="mb-3 flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Target className="h-4 w-4 shrink-0 opacity-80" />
                    <span className="text-xs font-medium uppercase tracking-wider">Objectif mensuel</span>
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-foreground">{progress}%</span>
                </p>
                <span className="block h-2 overflow-hidden rounded-full bg-muted/90 ring-1 ring-border/40">
                  <span
                    className="block h-full rounded-full bg-primary/90 transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </span>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Encore{" "}
                  <span className="font-medium text-foreground">{formatEur(remaining)}</span> pour atteindre
                  l’objectif indicatif ({formatEur(goalHt)} HT).
                </p>
              </section>
            </>
          )}
        </section>

        {hasVisibleUpsells || loading ? (
          <section>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Top extras visibles
            </p>
            {loading ? (
              <ul className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li key={i}>
                    <Skeleton className="h-14 w-full rounded-xl" />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-3">
                {upsells.map((item) => {
                  const Icon = item.icon
                  return (
                    <li
                      key={item.label}
                      className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 ring-1 transition-premium ${item.bg} ${item.ring}`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon className={`h-4 w-4 shrink-0 ${item.color}`} />
                        <span className="truncate text-sm font-medium text-foreground">{item.label}</span>
                      </span>
                      <span className={`shrink-0 text-sm font-semibold tabular-nums ${item.color}`}>
                        {item.amount}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        ) : null}
      </article>
    </DashboardSurface>
  )
}
