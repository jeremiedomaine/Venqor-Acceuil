function required(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Variable d'environnement manquante: ${name}`)
  }
  return value
}

export function getSupabaseUrl(): string {
  return required("NEXT_PUBLIC_SUPABASE_URL")
}

export function getSupabasePublishableKey(): string {
  return required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
}

export function getSupabaseSecretKey(): string {
  return required("SUPABASE_SECRET_KEY")
}

export function getVenqorDomainId(): string {
  return (
    process.env.VENQOR_DOMAIN_ID?.trim() ||
    "00000000-0000-0000-0000-000000000001"
  )
}

export function getVenqorDomainSlug(): string {
  return process.env.VENQOR_DOMAIN_SLUG?.trim() || "lauri-bastide"
}
