"use client"

import { useCallback, useEffect, useState } from "react"
import { DOMAIN_EVENTS_SEED, type DomainEventRecord } from "@/lib/domain-events"
import {
  DOMAIN_EVENTS_CHANGED,
  loadAllDomainEvents,
} from "@/lib/domain-events-store"

/** Réagit aux créations d’événements (localStorage + event global). */
export function useDomainEventsSync(): DomainEventRecord[] {
  const [events, setEvents] = useState<DomainEventRecord[]>(DOMAIN_EVENTS_SEED)

  const refresh = useCallback(() => {
    setEvents(loadAllDomainEvents())
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener(DOMAIN_EVENTS_CHANGED, refresh)
    window.addEventListener("focus", refresh)
    return () => {
      window.removeEventListener(DOMAIN_EVENTS_CHANGED, refresh)
      window.removeEventListener("focus", refresh)
    }
  }, [refresh])

  return events
}
