import {
  DOMAIN_EVENTS_SEED,
  getNextUpcomingEventItems,
  type DomainEventRecord,
  type DomainEventType,
} from "@/lib/domain-events"
import type { EventItem } from "@/lib/dashboard"

export { getNextUpcomingEventItems }

const STORAGE_KEY = "venqor-domain-events-extras"
export const DOMAIN_EVENTS_CHANGED = "venqor-events-changed"

export function loadExtraDomainEvents(): DomainEventRecord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DomainEventRecord[]) : []
  } catch {
    return []
  }
}

/** Seed + événements créés (les extras en tête, plus récents en premier). */
export function loadAllDomainEvents(): DomainEventRecord[] {
  const seedIds = new Set(DOMAIN_EVENTS_SEED.map((e) => e.id))
  const extras = loadExtraDomainEvents().filter((e) => !seedIds.has(e.id))
  return [...extras, ...DOMAIN_EVENTS_SEED]
}

export function persistDomainEvent(event: DomainEventRecord): void {
  if (typeof window === "undefined") return
  try {
    const extras = loadExtraDomainEvents().filter((e) => e.id !== event.id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([event, ...extras]))
    window.dispatchEvent(new Event(DOMAIN_EVENTS_CHANGED))
  } catch {
    /* ignore */
  }
}

export function countUniqueClients(events: DomainEventRecord[] = loadAllDomainEvents()): number {
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

export function getDashboardUpcomingEvents(limit = 3): EventItem[] {
  if (typeof window === "undefined") {
    return getNextUpcomingEventItems(limit, new Date(), DOMAIN_EVENTS_SEED)
  }
  return getNextUpcomingEventItems(limit, new Date(), loadAllDomainEvents())
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
