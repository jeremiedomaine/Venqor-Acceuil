"use client"

import Link from "next/link"
import { Package, Camera, Tent, UtensilsCrossed, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatEur } from "@/lib/domain-extras"
import {
  catalogueVisibleTotalHt,
  countVisibleCatalogueExtras,
  topCatalogueExtrasByPrice,
} from "@/lib/dashboard-stats"
import { useCatalogueSync } from "@/hooks/use-catalogue-sync"

const ICONS = [Camera, Tent, UtensilsCrossed] as const

export function FinanceColumn() {
  const { extras, loading } = useCatalogueSync()

  const visibleCount = countVisibleCatalogueExtras(extras)
  const totalHt = catalogueVisibleTotalHt(extras)
  const topExtras = topCatalogueExtrasByPrice(extras, 3)
  const hasCatalogue = extras.length > 0

  return (
    <section className="flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <header className="flex items-center justify-between border-b border-border px-6 py-5">
        <p className="flex items-center gap-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          <span className="text-base font-semibold tracking-tight text-foreground">
            Catalogue upsell
          </span>
        </p>
        <span className="rounded-md border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Données catalogue
        </span>
      </header>

      <article className="flex flex-1 flex-col justify-between gap-6 px-6 py-6">
        <section>
          {loading ? (
            <Skeleton className="h-14 w-48" />
          ) : !hasCatalogue ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">Catalogue vide</p>
              <p className="text-sm text-muted-foreground">
                Ajoutez vos premiers extras pour les proposer à vos clients.
              </p>
              <Button size="sm" className="mt-2" asChild>
                <Link href="/catalogue-extras">Créer un extra</Link>
              </Button>
            </div>
          ) : visibleCount === 0 ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">Aucun extra visible</p>
              <p className="text-sm text-muted-foreground">
                {extras.length} article{extras.length > 1 ? "s" : ""} au catalogue, tous masqués
                côté client.
              </p>
              <Button size="sm" variant="outline" className="mt-2" asChild>
                <Link href="/catalogue-extras">Gérer la visibilité</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="flex items-end gap-2">
                <span className="text-4xl font-bold tracking-tight text-primary tabular-nums">
                  {visibleCount}
                </span>
                <span className="pb-1 text-sm font-medium text-muted-foreground">
                  extra{visibleCount > 1 ? "s" : ""} visible{visibleCount > 1 ? "s" : ""}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Valeur catalogue HT (articles visibles) :{" "}
                <span className="font-medium text-foreground">{formatEur(totalHt)}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ce montant reflète vos tarifs catalogue, pas des ventes enregistrées.
              </p>
            </>
          )}

          <section className="mt-6 rounded-md border border-dashed border-border bg-muted/40 px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Suivi des revenus upsell
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Le chiffre d&apos;affaires mensuel et les ventes par extra arriveront dans une prochaine
              version. En attendant, consultez votre catalogue pour ajuster vos offres.
            </p>
          </section>
        </section>

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Top extras visibles (prix HT)
          </p>
          {loading ? (
            <ul className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i}>
                  <Skeleton className="h-12 w-full" />
                </li>
              ))}
            </ul>
          ) : topExtras.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun extra visible à afficher.
            </p>
          ) : (
            <ul className="space-y-3">
              {topExtras.map((item, i) => {
                const Icon = ICONS[i] ?? Camera
                const styles = [
                  { color: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200/80" },
                  { color: "text-sky-600", bg: "bg-sky-50", ring: "ring-sky-200/80" },
                  { color: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-200/80" },
                ][i]!
                return (
                  <li
                    key={item.id}
                    className={`flex items-center justify-between rounded-md px-3 py-2.5 ring-1 ${styles.bg} ${styles.ring}`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Icon className={`h-4 w-4 shrink-0 ${styles.color}`} />
                      <span className="truncate text-sm font-medium text-foreground">{item.label}</span>
                    </span>
                    <span className={`shrink-0 text-sm font-bold tabular-nums ${styles.color}`}>
                      {formatEur(item.priceEur)}
                    </span>
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
