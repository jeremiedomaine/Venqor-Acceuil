import type { Database } from "@/lib/supabase/database.types"
import type { DomainApp, DomainAppStatus } from "@/lib/domain-apps"
import { buildDomainAppHost } from "@/lib/domain/host"
import { slugifyDomain } from "@/lib/domain/slug"

export type DomainAppRow = Database["public"]["Tables"]["domain_apps"]["Row"]

export type DomainAppFormInput = {
  label: string
  slug: string
  status: DomainAppStatus
  description?: string | null
}

export const DOMAIN_APP_STATUS_OPTIONS: DomainAppStatus[] = [
  "Actif",
  "Brouillon",
  "Suspendu",
]

export function rowToDomainApp(row: DomainAppRow): DomainApp {
  return {
    id: row.id,
    label: row.label,
    slug: row.slug,
    host: row.host,
    status: row.status as DomainAppStatus,
    createdAt: row.created_at.slice(0, 10),
    description: row.description,
  }
}

export function recordToAppFormInput(app: DomainApp): DomainAppFormInput {
  return {
    label: app.label,
    slug: app.slug,
    status: app.status,
    description: app.description ?? "",
  }
}

export function emptyAppFormInput(): DomainAppFormInput {
  return {
    label: "",
    slug: "",
    status: "Actif",
    description: "",
  }
}

export function appToInsert(
  domainId: string,
  domainSlug: string,
  input: DomainAppFormInput,
): Database["public"]["Tables"]["domain_apps"]["Insert"] {
  const slug = slugifyDomain(input.slug || input.label)
  return {
    domain_id: domainId,
    label: input.label.trim(),
    slug,
    host: buildDomainAppHost(domainSlug, slug),
    status: input.status,
    description: input.description?.trim() || null,
  }
}

export function appFormToUpdateFields(
  domainSlug: string,
  input: DomainAppFormInput,
) {
  const slug = slugifyDomain(input.slug || input.label)
  return {
    label: input.label.trim(),
    slug,
    host: buildDomainAppHost(domainSlug, slug),
    status: input.status,
    description: input.description?.trim() || null,
  }
}
