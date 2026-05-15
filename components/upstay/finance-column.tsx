"use client"

import { useMemo } from "react"
import { TrendingUp, Camera, Tent, UtensilsCrossed, Target } from "lucide-react"
import { DOMAIN_EXTRAS_SEED, formatEur } from "@/lib/domain-extras"

const ICONS = [Camera, Tent, UtensilsCrossed] as const

export function FinanceColumn() {
  const { upsells, monthLabel, totalHt, goalHt, progress } = useMemo(() => {
    const visible = DOMAIN_EXTRAS_SEED.filter((e) => e.visible)
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
  }, [])

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
          <p className="flex items-end gap-3">
            <span className="text-5xl font-bold tracking-tight text-primary">
              + {formatEur(totalHt)}
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">générés ce mois en upsells (catalogue visible)</p>

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
                className="block h-2.5 rounded-full bg-primary transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </span>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {formatEur(totalHt)} sur {formatEur(goalHt)} · Il reste {formatEur(remaining)} pour
              atteindre l&apos;objectif
            </p>
          </section>
        </section>

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Détail des ventes
          </p>
          <ul className="flex flex-col gap-3">
            {upsells.map((item) => {
              const Icon = item.icon
              return (
                <li
                  key={item.label}
                  className="group flex list-none items-center gap-3 rounded-md border border-border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${item.bg} ${item.color} ring-1 ${item.ring} transition-transform group-hover:scale-105`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-sm font-bold tracking-tight text-foreground">{item.amount}</span>
                </li>
              )
            })}
          </ul>
        </section>
      </article>
    </section>
  )
}
