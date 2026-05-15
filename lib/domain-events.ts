import type { EventItem } from "@/lib/dashboard"

export type DomainEventType = "Mariage" | "Seminaire" | "Soiree privee"

export type BookingStatus = "Confirmé" | "Option" | "Terminé"

export type DomainEventTemporal = "past" | "upcoming" | "ongoing"

export type DomainEventRecord = {
  id: string
  title: string
  type: DomainEventType
  /** ISO date yyyy-mm-dd */
  dateStart: string
  dateEnd: string
  guestCount: number
  bookingStatus: BookingStatus
  /** Donneur d’ordre / société */
  clientOrOrg: string
  notes?: string | null
}

export const BOOKING_STATUS_OPTIONS: BookingStatus[] = [
  "Option",
  "Confirmé",
  "Terminé",
]

export const DOMAIN_EVENT_TYPE_OPTIONS: {
  value: DomainEventType
  label: string
}[] = [
  { value: "Mariage", label: "Mariage" },
  { value: "Seminaire", label: "Séminaire" },
  { value: "Soiree privee", label: "Soirée privée" },
]

export function typeLabel(t: DomainEventType): string {
  const found = DOMAIN_EVENT_TYPE_OPTIONS.find((o) => o.value === t)
  return found?.label ?? t
}

/** Données de démo — à remplacer par API / base plus tard */
export const DOMAIN_EVENTS_SEED: DomainEventRecord[] = [
  {
    id: "ev-1",
    title: "Mariage de Thomas & Léa",
    type: "Mariage",
    dateStart: "2025-05-14",
    dateEnd: "2025-05-16",
    guestCount: 180,
    bookingStatus: "Terminé",
    clientOrOrg: "Famille Thomas Martin",
  },
  {
    id: "ev-2",
    title: "Séminaire L'Oréal",
    type: "Seminaire",
    dateStart: "2025-05-22",
    dateEnd: "2025-05-22",
    guestCount: 45,
    bookingStatus: "Terminé",
    clientOrOrg: "L'Oréal France",
  },
  {
    id: "ev-3",
    title: "Soirée privée – Marc Dubois",
    type: "Soiree privee",
    dateStart: "2025-06-01",
    dateEnd: "2025-06-01",
    guestCount: 32,
    bookingStatus: "Terminé",
    clientOrOrg: "Marc Dubois",
  },
  {
    id: "ev-4",
    title: "Mariage Claire & Hugo",
    type: "Mariage",
    dateStart: "2025-09-12",
    dateEnd: "2025-09-13",
    guestCount: 120,
    bookingStatus: "Terminé",
    clientOrOrg: "Claire Bernard",
  },
  {
    id: "ev-5",
    title: "Team building TechCorp",
    type: "Seminaire",
    dateStart: "2026-02-03",
    dateEnd: "2026-02-04",
    guestCount: 60,
    bookingStatus: "Confirmé",
    clientOrOrg: "TechCorp SAS",
  },
  {
    id: "ev-6",
    title: "Anniversaire 50 ans – Mme Leroy",
    type: "Soiree privee",
    dateStart: "2026-03-21",
    dateEnd: "2026-03-21",
    guestCount: 85,
    bookingStatus: "Option",
    clientOrOrg: "Sophie Leroy",
  },
  {
    id: "ev-7",
    title: "Mariage Inès & Karim",
    type: "Mariage",
    dateStart: "2026-05-14",
    dateEnd: "2026-05-15",
    guestCount: 150,
    bookingStatus: "Confirmé",
    clientOrOrg: "Inès Benali",
  },
  {
    id: "ev-8",
    title: "Assemblée générale Coop Vin",
    type: "Seminaire",
    dateStart: "2026-05-14",
    dateEnd: "2026-05-14",
    guestCount: 110,
    bookingStatus: "Confirmé",
    clientOrOrg: "Coopérative Vin du Tarn",
  },
  {
    id: "ev-9",
    title: "Garden party – Château de X.",
    type: "Soiree privee",
    dateStart: "2026-06-28",
    dateEnd: "2026-06-28",
    guestCount: 200,
    bookingStatus: "Option",
    clientOrOrg: "SCI Les Lauriers",
  },
  {
    id: "ev-10",
    title: "Mariage Élodie & Paul",
    type: "Mariage",
    dateStart: "2026-08-02",
    dateEnd: "2026-08-03",
    guestCount: 95,
    bookingStatus: "Confirmé",
    clientOrOrg: "Élodie Marchand",
  },
  {
    id: "ev-11",
    title: "Convention nationale AssurPro",
    type: "Seminaire",
    dateStart: "2026-09-18",
    dateEnd: "2026-09-20",
    guestCount: 220,
    bookingStatus: "Option",
    clientOrOrg: "AssurPro Méditerranée",
  },
  {
    id: "ev-12",
    title: "Réveillon privé – Groupe Dupont",
    type: "Soiree privee",
    dateStart: "2026-12-31",
    dateEnd: "2027-01-01",
    guestCount: 40,
    bookingStatus: "Confirmé",
    clientOrOrg: "Famille Dupont",
  },
]

function parseLocalDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function getEventTemporal(row: DomainEventRecord, now = new Date()): DomainEventTemporal {
  const start = parseLocalDay(row.dateStart)
  const end = parseLocalDay(row.dateEnd)
  end.setHours(23, 59, 59, 999)
  const t = now.getTime()
  if (t > end.getTime()) return "past"
  if (t < start.getTime()) return "upcoming"
  return "ongoing"
}

export function formatPeriod(startIso: string, endIso: string) {
  const same = startIso === endIso
  const fmt = (iso: string) => {
    const d = parseLocalDay(iso)
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }
  if (same) return fmt(startIso)
  return `${fmt(startIso)} → ${fmt(endIso)}`
}

function listStyleForType(eventType: DomainEventType) {
  if (eventType === "Mariage") {
    return {
      badgeColor: "bg-rose-50 text-rose-600 ring-rose-200",
      icon: "heart" as const,
      iconColor: "text-rose-400",
      dotColor: "bg-rose-400",
    }
  }
  if (eventType === "Seminaire") {
    return {
      badgeColor: "bg-blue-50 text-blue-600 ring-blue-200",
      icon: "building" as const,
      iconColor: "text-blue-400",
      dotColor: "bg-blue-400",
    }
  }
  return {
    badgeColor: "bg-violet-50 text-violet-600 ring-violet-200",
    icon: "stars" as const,
    iconColor: "text-violet-400",
    dotColor: "bg-violet-400",
  }
}

function typeBadgeLabel(t: DomainEventType): string {
  if (t === "Seminaire") return "Séminaire"
  if (t === "Soiree privee") return "Soirée privée"
  return t
}

export function domainRecordToEventItem(r: DomainEventRecord): EventItem {
  const style = listStyleForType(r.type)
  return {
    id: r.id,
    title: r.title,
    date: formatPeriod(r.dateStart, r.dateEnd),
    badge: typeBadgeLabel(r.type),
    badgeColor: style.badgeColor,
    icon: style.icon,
    iconColor: style.iconColor,
    dotColor: style.dotColor,
    guests: `${r.guestCount} invités`,
  }
}

/** Prochains événements non terminés (à venir + en cours), triés par date de début. */
export function getNextUpcomingEventItems(
  limit = 3,
  now = new Date(),
  source: DomainEventRecord[] = DOMAIN_EVENTS_SEED,
): EventItem[] {
  return source
    .filter((r) => getEventTemporal(r, now) !== "past")
    .sort((a, b) => a.dateStart.localeCompare(b.dateStart) || a.id.localeCompare(b.id))
    .slice(0, limit)
    .map(domainRecordToEventItem)
}
