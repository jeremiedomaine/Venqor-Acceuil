import { createAdminClient } from "@/lib/supabase/admin"
import { slugifyDomain } from "@/lib/domain/slug"
import type { VenqorDomain } from "@/lib/domain/types"

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

export async function ensureUniqueDomainSlug(base: string): Promise<string> {
  const admin = createAdminClient()
  let candidate = slugifyDomain(base)
  let suffix = 0

  while (true) {
    const { data } = await admin
      .from("domains")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle()

    if (!data) return candidate
    suffix += 1
    candidate = `${slugifyDomain(base)}-${suffix}`
  }
}

export type ProvisionDomainInput = {
  userId: string
  name: string
  address?: string | null
  fullName?: string | null
}

/** Crée un domaine dédié + profil admin pour un nouvel opérateur. */
export async function provisionDomainForUser(
  input: ProvisionDomainInput,
): Promise<VenqorDomain> {
  const admin = createAdminClient()
  const name = input.name.trim()
  if (!name) {
    throw new Error("Le nom du domaine est requis.")
  }

  const slug = await ensureUniqueDomainSlug(name)

  const { data: domain, error: domainError } = await admin
    .from("domains")
    .insert({
      slug,
      name,
      address: input.address?.trim() || null,
    })
    .select("id, slug, name, address, cover_image_url")
    .single()

  if (domainError || !domain) {
    throw new Error(domainError?.message ?? "Impossible de créer le domaine.")
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: input.userId,
    domain_id: domain.id,
    full_name: input.fullName?.trim() || null,
    role: "admin",
  })

  if (profileError) {
    await admin.from("domains").delete().eq("id", domain.id)
    throw new Error(profileError.message)
  }

  await admin.from("catalogue_config").insert({
    domain_id: domain.id,
    intro_client: "",
    show_ttc_by_default: true,
    min_lead_days: 7,
    guest_booking_allowed: true,
    platform_fee_percent: 8,
  })

  return mapRow(domain)
}
