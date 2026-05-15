"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { CalendarDays, UserPlus, Plus, Heart, Building2, Stars, Loader2 } from "lucide-react"
import { EventFormDialog } from "@/components/upstay/event-form-dialog"
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
    <section className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <header className="flex items-center justify-between border-b border-border px-6 py-5">
        <p className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <span className="text-base font-semibold tracking-tight text-foreground">
            Prochains Événements
          </span>
        </p>
        <p className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs text-muted-foreground transition-all hover:text-foreground"
            asChild
          >
            <Link href="/evenements">
              <UserPlus className="h-3.5 w-3.5" />
              Registre complet
            </Link>
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Créer événement
          </Button>
        </p>
      </header>

      <ul className="divide-y divide-border px-6 py-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex items-center gap-4 py-4">
              <Skeleton className="h-11 w-11 shrink-0 rounded-md" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-4 w-12" />
            </li>
          ))
        ) : eventList.length === 0 ? (
          <li className="py-8 text-center">
            <p className="text-sm text-muted-foreground">Aucun événement à venir.</p>
            <Button
              variant="link"
              size="sm"
              className="mt-1"
              onClick={() => setCreateOpen(true)}
            >
              Planifier un événement
            </Button>
          </li>
        ) : (
          eventList.slice(0, 3).map((event) => {
            const Icon = iconMap[event.icon]
            return (
              <li
                key={event.id}
                className="group flex list-none items-center gap-4 py-4 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-muted transition-transform group-hover:scale-105",
                    event.iconColor,
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold tracking-tight text-foreground">
                    {event.title}
                  </span>
                  <span className="mt-0.5 flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1",
                        event.badgeColor,
                      )}
                    >
                      {event.badge}
                    </span>
                    <span className="text-xs text-muted-foreground">{event.guests}</span>
                  </span>
                </span>

                <span className="flex flex-col items-end gap-1">
                  <span className={cn("h-2 w-2 rounded-full", event.dotColor)} />
                  <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
                    {event.date}
                  </span>
                </span>
              </li>
            )
          })
        )}
      </ul>

      <footer className="border-t border-border px-6 py-4">
        <Link
          href="/evenements"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {loading ? (
            <>
              <Loader2 className="size-3 animate-spin" />
              Chargement…
            </>
          ) : (
            <>Voir tous les événements →</>
          )}
        </Link>
      </footer>

      <EventFormDialog mode="create" open={createOpen} onOpenChange={setCreateOpen} />
    </section>
  )
}
