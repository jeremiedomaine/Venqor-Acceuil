import { rowToDomainApp } from "@/lib/data/domain-apps"
import type { DomainApp } from "@/lib/domain-apps"
import { createAdminClient } from "@/lib/supabase/admin"

export type PublicWeddingPortal = {
  domain: {
    id: string
    name: string
    slug: string
    address: string | null
    coverImageUrl: string | null
  }
  app: DomainApp
}

export async function getPublicWeddingPortal(
  domainSlug: string,
  appSlug: string,
): Promise<PublicWeddingPortal | null> {
  const admin = createAdminClient()

  const { data: domain, error: domainError } = await admin
    .from("domains")
    .select("id, name, slug, address, cover_image_url")
    .eq("slug", domainSlug)
    .maybeSingle()

  if (domainError || !domain) {
    return null
  }

  const { data: appRow, error: appError } = await admin
    .from("domain_apps")
    .select("*")
    .eq("domain_id", domain.id)
    .eq("slug", appSlug)
    .eq("status", "Actif")
    .maybeSingle()

  if (appError || !appRow) {
    return null
  }

  return {
    domain: {
      id: domain.id,
      name: domain.name,
      slug: domain.slug,
      address: domain.address,
      coverImageUrl: domain.cover_image_url,
    },
    app: rowToDomainApp(appRow),
  }
}
