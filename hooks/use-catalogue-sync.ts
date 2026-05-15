"use client"

import { useCallback, useEffect, useState } from "react"
import {
  getCatalogueConfigAction,
  listCatalogueExtrasAction,
} from "@/app/actions/catalogue"
import { emptyCatalogueConfig } from "@/lib/data/catalogue"
import type { CatalogueConfig, DomainExtra } from "@/lib/domain-extras"

export const DOMAIN_CATALOGUE_CHANGED = "venqor-catalogue-changed"

export function useCatalogueSync() {
  const [extras, setExtras] = useState<DomainExtra[]>([])
  const [config, setConfig] = useState<CatalogueConfig>(emptyCatalogueConfig())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [extrasRows, configRow] = await Promise.all([
        listCatalogueExtrasAction(),
        getCatalogueConfigAction(),
      ])
      setExtras(extrasRows)
      setConfig(configRow)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement")
      setExtras([])
      setConfig(emptyCatalogueConfig())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const onChanged = () => void refresh()
    window.addEventListener(DOMAIN_CATALOGUE_CHANGED, onChanged)
    return () => window.removeEventListener(DOMAIN_CATALOGUE_CHANGED, onChanged)
  }, [refresh])

  return { extras, config, setConfig, loading, error, refresh }
}
