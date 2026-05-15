"use client"

import { useCallback, useEffect, useState } from "react"
import { listDomainAppsAction } from "@/app/actions/domain-apps"
import type { DomainApp } from "@/lib/domain-apps"

export const DOMAIN_APPS_CHANGED = "venqor-apps-changed"

export function useDomainAppsSync() {
  const [apps, setApps] = useState<DomainApp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rows = await listDomainAppsAction()
      setApps(rows)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement")
      setApps([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const onChanged = () => void refresh()
    window.addEventListener(DOMAIN_APPS_CHANGED, onChanged)
    return () => window.removeEventListener(DOMAIN_APPS_CHANGED, onChanged)
  }, [refresh])

  return { apps, loading, error, refresh }
}
