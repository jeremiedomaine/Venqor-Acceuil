"use client"

import { useCallback, useEffect, useState } from "react"
import { listDomainEventsAction } from "@/app/actions/events"
import type { DomainEventRecord } from "@/lib/domain-events"

export const DOMAIN_EVENTS_CHANGED = "venqor-events-changed"

/** Charge les événements depuis Supabase et réagit aux créations locales. */
export function useDomainEventsSync(): {
  events: DomainEventRecord[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
} {
  const [events, setEvents] = useState<DomainEventRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rows = await listDomainEventsAction()
      setEvents(rows)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement")
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const onChanged = () => void refresh()
    window.addEventListener(DOMAIN_EVENTS_CHANGED, onChanged)
    return () => window.removeEventListener(DOMAIN_EVENTS_CHANGED, onChanged)
  }, [refresh])

  return { events, loading, error, refresh }
}
