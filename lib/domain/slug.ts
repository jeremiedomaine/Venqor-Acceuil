/** Slug URL-safe pour un domaine Venqor (ex. chateau-mirabel). */
export function slugifyDomain(input: string): string {
  const slug = input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)

  return slug || `domaine-${Date.now().toString(36)}`
}
