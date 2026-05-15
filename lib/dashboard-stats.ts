import type { DomainEventRecord } from "@/lib/domain-events"
import { getEventTemporal } from "@/lib/domain-events"
import type { DomainExtra } from "@/lib/domain-extras"

export function countUniqueClients(events: DomainEventRecord[]): number {
  const names = new Set(
    events.map((e) => e.clientOrOrg.trim().toLowerCase()).filter(Boolean),
  )
  return names.size
}

export function countUpcomingEvents(events: DomainEventRecord[], now = new Date()): number {
  return events.filter((e) => {
    const t = getEventTemporal(e, now)
    return t === "upcoming" || t === "ongoing"
  }).length
}

export function countVisibleCatalogueExtras(extras: DomainExtra[]): number {
  return extras.filter((e) => e.visible).length
}

/** Somme HT des extras visibles — potentiel catalogue, pas des ventes réalisées. */
export function catalogueVisibleTotalHt(extras: DomainExtra[]): number {
  return extras.filter((e) => e.visible).reduce((sum, e) => sum + e.priceEur, 0)
}

export function topCatalogueExtrasByPrice(extras: DomainExtra[], limit = 3): DomainExtra[] {
  return [...extras]
    .filter((e) => e.visible)
    .sort((a, b) => b.priceEur - a.priceEur)
    .slice(0, limit)
}
