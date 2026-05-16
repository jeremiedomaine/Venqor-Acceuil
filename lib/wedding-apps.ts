import { slugifyDomain } from "@/lib/domain/slug"

const FRENCH_MONTHS_SLUG = [
  "janvier",
  "fevrier",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "aout",
  "septembre",
  "octobre",
  "novembre",
  "decembre",
] as const

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function formatWeddingDateLong(iso: string): string {
  const d = parseLocalDate(iso)
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatWeddingDateShort(iso: string): string {
  const d = parseLocalDate(iso)
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatCoupleNames(partnerOne: string, partnerTwo: string): string {
  const a = partnerOne.trim()
  const b = partnerTwo.trim()
  if (!a && !b) return "Les mariés"
  if (!b) return a
  if (!a) return b
  return `${a} & ${b}`
}

/** Libellé back-office : « Mariage de Marie & Pierre — 14 juin 2026 » */
export function buildWeddingAppLabel(
  partnerOne: string,
  partnerTwo: string,
  weddingDate: string,
): string {
  const couple = formatCoupleNames(partnerOne, partnerTwo)
  const dateLabel = formatWeddingDateShort(weddingDate)
  return `Mariage de ${couple} — ${dateLabel}`
}

/** Slug URL : marie-et-pierre-14-juin-2026 */
export function buildWeddingAppSlug(
  partnerOne: string,
  partnerTwo: string,
  weddingDate: string,
): string {
  const first = slugifyDomain(partnerOne.split(/\s+/)[0] || partnerOne)
  const second = slugifyDomain(partnerTwo.split(/\s+/)[0] || partnerTwo)
  const d = parseLocalDate(weddingDate)
  const day = d.getDate()
  const month = FRENCH_MONTHS_SLUG[d.getMonth()]
  const year = d.getFullYear()

  const base = [first, "et", second, String(day), month, String(year)]
    .filter(Boolean)
    .join("-")

  return base.slice(0, 56) || `mariage-${Date.now().toString(36).slice(-6)}`
}

export function buildWeddingPublicPath(domainSlug: string, appSlug: string): string {
  return `/espace/${domainSlug}/${appSlug}`
}

export function buildWeddingPublicUrl(
  domainSlug: string,
  appSlug: string,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://acceuil.venqor.app",
): string {
  const base = siteUrl.replace(/\/$/, "")
  return `${base}${buildWeddingPublicPath(domainSlug, appSlug)}`
}
