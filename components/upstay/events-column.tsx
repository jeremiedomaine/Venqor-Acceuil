"use client"

import { useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { CalendarDays, UserPlus, Plus, Heart, Building2, Stars } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { getNextUpcomingEventItems } from "@/lib/domain-events"
import {
  createDomainEventFromForm,
  persistDomainEvent,
} from "@/lib/domain-events-store"
import { useDomainEventsSync } from "@/hooks/use-domain-events-sync"

const iconMap = {
  heart: Heart,
  building: Building2,
  stars: Stars,
}

export function EventsColumn() {
  const allEvents = useDomainEventsSync()
  const eventList = useMemo(
    () => getNextUpcomingEventItems(3, new Date(), allEvents),
    [allEvents],
  )

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    eventType: "Mariage",
    dateStart: "",
    dateEnd: "",
    guests: "",
    clientOrOrg: "",
    notes: "",
  })

  const handleCreateEvent = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const title = formData.title.trim()
    const dateStart = formData.dateStart.trim()
    const guests = Number(formData.guests)

    if (!title || !dateStart || !guests || guests < 1) return

    persistDomainEvent(
      createDomainEventFromForm({
        title,
        eventType: formData.eventType,
        dateStart,
        dateEnd: formData.dateEnd.trim() || dateStart,
        guests,
        clientOrOrg: formData.clientOrOrg,
        notes: formData.notes,
      }),
    )

    setFormData({
      title: "",
      eventType: "Mariage",
      dateStart: "",
      dateEnd: "",
      guests: "",
      clientOrOrg: "",
      notes: "",
    })
    setOpen(false)
  }

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
              Ajouter un client
            </Link>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" />
                Créer événement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un événement</DialogTitle>
                <DialogDescription>
                  L&apos;événement apparaîtra sur le tableau de bord et dans le registre.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateEvent} className="grid gap-4">
                <p className="grid gap-2">
                  <Label htmlFor="event-title">Nom de l&apos;événement</Label>
                  <Input
                    id="event-title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Mariage de Claire & Hugo"
                    required
                  />
                </p>

                <p className="grid gap-2">
                  <Label htmlFor="event-type">Type d&apos;événement</Label>
                  <select
                    id="event-type"
                    value={formData.eventType}
                    onChange={(e) => setFormData((prev) => ({ ...prev, eventType: e.target.value }))}
                    className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  >
                    <option value="Mariage">Mariage</option>
                    <option value="Seminaire">Seminaire</option>
                    <option value="Soiree">Soiree privee</option>
                  </select>
                </p>

                <p className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                  <span className="grid gap-2">
                    <Label htmlFor="event-date-start">Date de début</Label>
                    <Input
                      id="event-date-start"
                      type="date"
                      value={formData.dateStart}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dateStart: e.target.value }))}
                      required
                    />
                  </span>
                  <span className="grid gap-2">
                    <Label htmlFor="event-date-end">Date de fin (optionnel)</Label>
                    <Input
                      id="event-date-end"
                      type="date"
                      value={formData.dateEnd}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dateEnd: e.target.value }))}
                    />
                  </span>
                </p>

                <p className="grid gap-2">
                  <Label htmlFor="event-client">Client / organisation</Label>
                  <Input
                    id="event-client"
                    value={formData.clientOrOrg}
                    onChange={(e) => setFormData((prev) => ({ ...prev, clientOrOrg: e.target.value }))}
                    placeholder="Ex: Famille Martin"
                    required
                  />
                </p>

                <p className="grid gap-2">
                  <Label htmlFor="event-guests">Nombre de participants</Label>
                  <Input
                    id="event-guests"
                    type="number"
                    min="1"
                    value={formData.guests}
                    onChange={(e) => setFormData((prev) => ({ ...prev, guests: e.target.value }))}
                    placeholder="Ex: 120"
                    required
                  />
                </p>

                <p className="grid gap-2">
                  <Label htmlFor="event-notes">Notes (optionnel)</Label>
                  <Textarea
                    id="event-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Infos complementaires..."
                  />
                </p>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Créer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </p>
      </header>

      <ul className="divide-y divide-border px-6 py-2">
        {eventList.length === 0 ? (
          <li className="py-8 text-center text-sm text-muted-foreground">Aucun événement à afficher.</li>
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
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Voir tous les événements →
        </Link>
      </footer>
    </section>
  )
}
