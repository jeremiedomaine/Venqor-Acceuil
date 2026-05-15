"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { VenqorDomain } from "@/lib/domain/types"

const DomainContext = createContext<VenqorDomain | null>(null)

export function DomainProvider({
  domain,
  children,
}: {
  domain: VenqorDomain
  children: ReactNode
}) {
  return (
    <DomainContext.Provider value={domain}>{children}</DomainContext.Provider>
  )
}

export function useDomain(): VenqorDomain {
  const domain = useContext(DomainContext)
  if (!domain) {
    throw new Error("useDomain doit être utilisé dans un DomainProvider.")
  }
  return domain
}
