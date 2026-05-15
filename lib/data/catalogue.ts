import type { Database } from "@/lib/supabase/database.types"
import {
  DEFAULT_CATALOGUE_CONFIG,
  type CatalogueConfig,
  type DomainExtra,
  type ExtraCategory,
} from "@/lib/domain-extras"

export type CatalogueExtraRow =
  Database["public"]["Tables"]["catalogue_extras"]["Row"]

export type CatalogueConfigRow =
  Database["public"]["Tables"]["catalogue_config"]["Row"]

export type ExtraFormInput = {
  label: string
  description: string
  priceEur: number
  category: ExtraCategory
  visible: boolean
  vatPercent: number
}

export function rowToDomainExtra(row: CatalogueExtraRow): DomainExtra {
  return {
    id: row.id,
    label: row.label,
    description: row.description,
    priceEur: Number(row.price_eur),
    category: row.category as ExtraCategory,
    visible: row.visible,
    vatPercent: Number(row.vat_percent),
  }
}

export function rowToCatalogueConfig(row: CatalogueConfigRow): CatalogueConfig {
  return {
    showTtcByDefault: row.show_ttc_by_default,
    introClient: row.intro_client,
    minLeadDays: row.min_lead_days,
    guestBookingAllowed: row.guest_booking_allowed,
    platformFeePercent: Number(row.platform_fee_percent),
  }
}

export function emptyCatalogueConfig(): CatalogueConfig {
  return { ...DEFAULT_CATALOGUE_CONFIG }
}

export function extraFormToFields(input: ExtraFormInput) {
  return {
    label: input.label.trim(),
    description: input.description.trim(),
    price_eur: input.priceEur,
    category: input.category,
    visible: input.visible,
    vat_percent: input.vatPercent,
  }
}

export function recordToExtraFormInput(extra: DomainExtra): ExtraFormInput {
  return {
    label: extra.label,
    description: extra.description,
    priceEur: extra.priceEur,
    category: extra.category,
    visible: extra.visible,
    vatPercent: extra.vatPercent,
  }
}

export function emptyExtraFormInput(): ExtraFormInput {
  return {
    label: "",
    description: "",
    priceEur: 0,
    category: "Animation",
    visible: true,
    vatPercent: 20,
  }
}

export function configFormToFields(config: CatalogueConfig) {
  return {
    show_ttc_by_default: config.showTtcByDefault,
    intro_client: config.introClient.trim(),
    min_lead_days: config.minLeadDays,
    guest_booking_allowed: config.guestBookingAllowed,
    platform_fee_percent: config.platformFeePercent,
  }
}

export function extraToInsert(
  domainId: string,
  input: ExtraFormInput,
  sortOrder: number,
): Database["public"]["Tables"]["catalogue_extras"]["Insert"] {
  return {
    domain_id: domainId,
    ...extraFormToFields(input),
    sort_order: sortOrder,
  }
}
