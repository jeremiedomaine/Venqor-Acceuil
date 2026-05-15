const PLATFORM_SUFFIX = ".venqor.app"

/** Portail unique (tenant résolu via le profil connecté). */
export function isSharedAccueilHost(host: string): boolean {
  const h = normalizeHost(host)
  return h === "acceuil.venqor.app" || h === "localhost" || h.endsWith(".vercel.app")
}

function normalizeHost(host: string): string {
  return host.split(":")[0].trim().toLowerCase()
}

/**
 * Extrait le slug tenant depuis l'hôte.
 * Ex. `lauri-bastide.acceuil.venqor.app` → `lauri-bastide`
 * Ex. `extras.lauri-bastide.venqor.app` → `lauri-bastide` (sous-app)
 */
export function parseDomainSlugFromHost(host: string): string | null {
  const h = normalizeHost(host)
  if (!h.endsWith(PLATFORM_SUFFIX) || isSharedAccueilHost(h)) {
    return null
  }

  const labels = h.slice(0, -PLATFORM_SUFFIX.length).split(".").filter(Boolean)
  if (labels.length === 0) return null

  // {slug}.acceuil.venqor.app
  if (labels.length >= 2 && labels[labels.length - 1] === "acceuil") {
    return labels[0]
  }

  // {app}.{slug}.venqor.app
  if (labels.length >= 2) {
    return labels[labels.length - 1]
  }

  return labels[0]
}

export function buildDomainAppHost(domainSlug: string, appSlug: string): string {
  return `${appSlug}.${domainSlug}.venqor.app`
}
