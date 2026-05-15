"use client"

import { useCallback, useEffect, useState } from "react"
import { listPrestatairesAction } from "@/app/actions/prestataires"
import type { PrestataireRecord } from "@/lib/prestataires"

export const DOMAIN_PRESTATAIRES_CHANGED = "venqor-prestataires-changed"

export function usePrestatairesSync() {
  const [prestataires, setPrestataires] = useState<PrestataireRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rows = await listPrestatairesAction()
      setPrestataires(rows)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement")
      setPrestataires([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const onChanged = () => void refresh()
    window.addEventListener(DOMAIN_PRESTATAIRES_CHANGED, onChanged)
    return () => window.removeEventListener(DOMAIN_PRESTATAIRES_CHANGED, onChanged)
  }, [refresh])

  return { prestataires, loading, error, refresh }
}
