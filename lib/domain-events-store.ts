import {
  DOMAIN_EVENTS_SEED,
  getNextUpcomingEventItems,
  type DomainEventRecord,
  type DomainEventType,
} from "@/lib/domain-events"
import type { EventItem } from "@/lib/dashboard"

export { getNextUpcomingEventItems }
export { DOMAIN_EVENTS_CHANGED } from "@/hooks/use-domain-events-sync"

export function countUniqueClients(events: DomainEventRecord[]): number {
  const names = new Set(
    events.map((e) => e.clientOrOrg.trim().toLowerCase()).filter(Boolean),
  )
  return names.size
}

export function mapFormTypeToDomainType(eventType: string): DomainEventType {
  if (eventType === "Seminaire" || eventType === "Séminaire") return "Seminaire"
  if (eventType === "Soiree" || eventType === "Soiree privee" || eventType === "Soirée privée") {
    return "Soiree privee"
  }
  return "Mariage"
}

export function createDomainEventFromForm(input: {
  title: string
  eventType: string
  dateStart: string
  dateEnd?: string
  guests: number
  clientOrOrg: string
  notes?: string
}): DomainEventRecord {
  const dateEnd = input.dateEnd?.trim() || input.dateStart
  return {
    id: `ev-${Date.now()}`,
    title: input.title.trim(),
    type: mapFormTypeToDomainType(input.eventType),
    dateStart: input.dateStart,
    dateEnd,
    guestCount: input.guests,
    bookingStatus: "Option",
    clientOrOrg: input.clientOrOrg.trim() || "Client non renseigné",
  }
}

/** Fallback SSR sans base (seed uniquement). */
export function getDashboardUpcomingEvents(limit = 3): EventItem[] {
  return getNextUpcomingEventItems(limit, new Date(), DOMAIN_EVENTS_SEED)
}
