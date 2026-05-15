"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  UserPlus,
  Plus,
  Heart,
  Building2,
  Stars,
  Loader2,
  CalendarPlus,
  ArrowUpRight,
} from "lucide-react"
import { EventFormDialog } from "@/components/upstay/event-form-dialog"
import { DashboardSurface } from "@/components/upstay/dashboard-surface"
import { EmptyState } from "@/components/upstay/empty-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getNextUpcomingEventItems } from "@/lib/domain-events"
import { useDomainEventsSync } from "@/hooks/use-domain-events-sync"

const iconMap = {
  heart: Heart,
  building: Building2,
  stars: Stars,
}

export function EventsColumn() {
  const { events: allEvents, loading } = useDomainEventsSync()
  const eventList = useMemo(
    () => getNextUpcomingEventItems(3, new Date(), allEvents),
    [allEvents],
  )

  const [createOpen, setCreateOpen] = useState(false)

  return (
    <DashboardSurface className="flex flex-col">
      <header className="flex flex-col gap-4 border-b border-border/60 px-7 py-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <p className="flex items-center gap-2.5 text-muted-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarDays className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-base font-semibold tracking-tight text-foreground">
              Prochains événements
            </span>
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Aperçu de ce qui arrive sur les prochaines semaines.
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="transition-premium h-9 rounded-lg border-border/80 bg-background/50 px-3.5 text-muted-foreground hover:border-border hover:bg-background hover:text-foreground" asChild>
            <Link href="/evenements" className="gap-2">
              <UserPlus className="h-3.5 w-3.5" />
              Registre complet
            </Link>
          </Button>
          <Button
            size="sm"
            className="transition-premium h-9 gap-2 rounded-lg px-4 shadow-sm shadow-primary/10"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Créer un événement
          </Button>
        </div>
      </header>

      <div className="px-2 py-1">
        <ul className="divide-y divide-border/50 px-5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="flex items-center gap-4 py-5">
                <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-4 w-14" />
              </li>
            ))
          ) : eventList.length === 0 ? (
            <li className="list-none py-2">
              <EmptyState
                icon={CalendarPlus}
                title="Aucun événement à afficher"
                description="Dès qu’une date confirmée ou en option est prévue, elle apparaît ici pour que vous gardiez une vision claire du calendrier."
              >
                <Button
                  className="rounded-lg shadow-sm shadow-primary/10 transition-premium"
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Planifier un événement
                </Button>
                <Button variant="outline" className="rounded-lg border-border/80 transition-premium" asChild>
                  <Link href="/evenements">Voir le registre</Link>
                </Button>
              </EmptyState>
            </li>
          ) : (
            eventList.slice(0, 3).map((event) => {
              const Icon = iconMap[event.icon]
              return (
                <li key={event.id} className="group flex list-none items-center gap-4 rounded-xl py-4 pl-2 pr-3 transition-premium hover:bg-muted/40">
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/90 ring-1 ring-border/40 transition-transform duration-200 group-hover:scale-[1.03]",
                      event.iconColor,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium leading-snug tracking-tight text-foreground">
                      {event.title}
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
                          event.badgeColor,
                        )}
                      >
                        {event.badge}
                      </span>
                      <span className="text-xs text-muted-foreground">{event.guests}</span>
                    </span>
                  </span>

                  <span className="flex flex-shrink-0 flex-col items-end gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full shadow-sm", event.dotColor)} />
                    <span className="whitespace-nowrap text-xs font-medium tabular-nums text-muted-foreground">
                      {event.date}
                    </span>
                  </span>
                </li>
              )
            })
          )}
        </ul>
      </div>

      <footer className="border-t border-border/60 px-7 py-5">
        <Link
          href="/evenements"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-premium hover:text-primary"
        >
          {loading ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Chargement…
            </>
          ) : (
            <>
              Voir tous les événements
              <ArrowUpRight className="size-3.5 opacity-70" />
            </>
          )}
        </Link>
      </footer>

      <EventFormDialog mode="create" open={createOpen} onOpenChange={setCreateOpen} />
    </DashboardSurface>
  )
}
