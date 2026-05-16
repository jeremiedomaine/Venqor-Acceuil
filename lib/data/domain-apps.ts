import type { Database } from "@/lib/supabase/database.types"
import type { DomainApp, DomainAppStatus } from "@/lib/domain-apps"
import { buildDomainAppHost } from "@/lib/domain/host"
import {
  buildWeddingAppLabel,
  buildWeddingAppSlug,
} from "@/lib/wedding-apps"

export type DomainAppRow = Database["public"]["Tables"]["domain_apps"]["Row"]

export type WeddingAppFormInput = {
  partnerOne: string
  partnerTwo: string
  weddingDate: string
  welcomeMessage?: string | null
  status: DomainAppStatus
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
    partnerOne: row.partner_one ?? "",
    partnerTwo: row.partner_two ?? "",
    weddingDate: row.wedding_date?.slice(0, 10) ?? row.created_at.slice(0, 10),
    welcomeMessage: row.welcome_message,
    description: row.description,
  }
}

export function recordToWeddingAppFormInput(app: DomainApp): WeddingAppFormInput {
  return {
    partnerOne: app.partnerOne,
    partnerTwo: app.partnerTwo,
    weddingDate: app.weddingDate,
    welcomeMessage: app.welcomeMessage ?? "",
    status: app.status,
  }
}

export function emptyWeddingAppFormInput(): WeddingAppFormInput {
  return {
    partnerOne: "",
    partnerTwo: "",
    weddingDate: "",
    welcomeMessage: "",
    status: "Actif",
  }
}

function weddingFieldsFromInput(input: WeddingAppFormInput) {
  const partnerOne = input.partnerOne.trim()
  const partnerTwo = input.partnerTwo.trim()
  const weddingDate = input.weddingDate.trim()
  const label = buildWeddingAppLabel(partnerOne, partnerTwo, weddingDate)
  const slug = buildWeddingAppSlug(partnerOne, partnerTwo, weddingDate)

  return {
    partner_one: partnerOne,
    partner_two: partnerTwo,
    wedding_date: weddingDate,
    label,
    slug,
    welcome_message: input.welcomeMessage?.trim() || null,
    status: input.status,
  }
}

export function weddingAppToInsert(
  domainId: string,
  domainSlug: string,
  input: WeddingAppFormInput,
): Database["public"]["Tables"]["domain_apps"]["Insert"] {
  const fields = weddingFieldsFromInput(input)
  return {
    domain_id: domainId,
    ...fields,
    host: buildDomainAppHost(domainSlug, fields.slug),
    description: null,
  }
}

export function weddingAppFormToUpdateFields(
  domainSlug: string,
  input: WeddingAppFormInput,
) {
  const fields = weddingFieldsFromInput(input)
  return {
    ...fields,
    host: buildDomainAppHost(domainSlug, fields.slug),
    description: null,
  }
}
