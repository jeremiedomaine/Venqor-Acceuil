import { createAdminClient } from "@/lib/supabase/admin"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getVenqorDomainId } from "@/lib/supabase/env"
import { DomainError, type VenqorDomain } from "@/lib/domain/types"

function mapRow(row: {
  id: string
  slug: string
  name: string
  address: string | null
  cover_image_url: string | null
}): VenqorDomain {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    address: row.address,
    coverImageUrl: row.cover_image_url,
  }
}

async function fetchDomainById(domainId: string): Promise<VenqorDomain> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("domains")
    .select("id, slug, name, address, cover_image_url")
    .eq("id", domainId)
    .single()

  if (error || !data) {
    throw new DomainError("DOMAIN_NOT_FOUND", "Domaine introuvable.")
  }

  return mapRow(data)
}

/** Secours dev / scripts : domaine défini dans VENQOR_DOMAIN_ID. */
export async function getDomainFromEnv(): Promise<VenqorDomain> {
  return fetchDomainById(getVenqorDomainId())
}

/**
 * Domaine du compte connecté (profiles.domain_id → domains).
 * C'est la source de vérité en production multi-tenant.
 */
export async function getCurrentDomain(): Promise<VenqorDomain> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new DomainError("UNAUTHENTICATED", "Connexion requise.")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("domain_id")
    .eq("id", user.id)
    .maybeSingle()

  if (profileError || !profile?.domain_id) {
    throw new DomainError(
      "NO_PROFILE",
      "Créez votre espace Venqor pour commencer.",
    )
  }

  const { data: domain, error: domainError } = await supabase
    .from("domains")
    .select("id, slug, name, address, cover_image_url")
    .eq("id", profile.domain_id)
    .single()

  if (!domainError && domain) {
    return mapRow(domain)
  }

  // Secours tant que la policy domains_select_by_profile n'est pas migrée :
  // on ne charge que le domaine lié au profil (pas d'énumération cross-tenant).
  try {
    return await fetchDomainById(profile.domain_id)
  } catch {
    if (process.env.NODE_ENV === "development") {
      return getDomainFromEnv()
    }
    throw new DomainError("DOMAIN_NOT_FOUND", "Domaine introuvable.")
  }
}

/** ID tenant pour les server actions — jamais depuis le client. */
export async function requireDomainId(): Promise<string> {
  const domain = await getCurrentDomain()
  return domain.id
}

export async function getDomainBySlug(slug: string): Promise<VenqorDomain | null> {
  const admin = createAdminClient()
  const { data } = await admin
    .from("domains")
    .select("id, slug, name, address, cover_image_url")
    .eq("slug", slug)
    .maybeSingle()

  return data ? mapRow(data) : null
}
