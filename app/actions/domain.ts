"use server"

import { getCurrentDomain } from "@/lib/domain/server"
import type { VenqorDomain } from "@/lib/domain/types"

export async function getCurrentDomainAction(): Promise<VenqorDomain> {
  return getCurrentDomain()
}
