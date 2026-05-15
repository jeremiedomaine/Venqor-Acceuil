"use server"

import { revalidatePath } from "next/cache"
import {
  configFormToFields,
  emptyCatalogueConfig,
  extraToInsert,
  rowToCatalogueConfig,
  rowToDomainExtra,
  type ExtraFormInput,
} from "@/lib/data/catalogue"
import { requireDomainId } from "@/lib/domain/server"
import type { CatalogueConfig, DomainExtra } from "@/lib/domain-extras"
import { createServerSupabaseClient } from "@/lib/supabase/server"

function revalidateCataloguePages() {
  revalidatePath("/catalogue-extras")
  revalidatePath("/")
}

export async function listCatalogueExtrasAction(): Promise<DomainExtra[]> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data, error } = await supabase
    .from("catalogue_extras")
    .select("*")
    .eq("domain_id", domainId)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[listCatalogueExtrasAction]", error.message)
    throw new Error("Impossible de charger le catalogue.")
  }

  return (data ?? []).map(rowToDomainExtra)
}

export async function getCatalogueConfigAction(): Promise<CatalogueConfig> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data, error } = await supabase
    .from("catalogue_config")
    .select("*")
    .eq("domain_id", domainId)
    .maybeSingle()

  if (error) {
    console.error("[getCatalogueConfigAction]", error.message)
    throw new Error("Impossible de charger la configuration.")
  }

  return data ? rowToCatalogueConfig(data) : emptyCatalogueConfig()
}

export async function updateCatalogueConfigAction(
  config: CatalogueConfig,
): Promise<CatalogueConfig> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data, error } = await supabase
    .from("catalogue_config")
    .upsert(
      { domain_id: domainId, ...configFormToFields(config) },
      { onConflict: "domain_id" },
    )
    .select("*")
    .single()

  if (error) {
    console.error("[updateCatalogueConfigAction]", error.message)
    throw new Error("Impossible d'enregistrer la configuration.")
  }

  revalidateCataloguePages()
  return rowToCatalogueConfig(data)
}

export async function createCatalogueExtraAction(
  input: ExtraFormInput,
): Promise<DomainExtra> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data: maxRow } = await supabase
    .from("catalogue_extras")
    .select("sort_order")
    .eq("domain_id", domainId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle()

  const sortOrder = (maxRow?.sort_order ?? -1) + 1

  const { data, error } = await supabase
    .from("catalogue_extras")
    .insert(extraToInsert(domainId, input, sortOrder))
    .select("*")
    .single()

  if (error) {
    console.error("[createCatalogueExtraAction]", error.message)
    throw new Error("Impossible de créer l'extra.")
  }

  revalidateCataloguePages()
  return rowToDomainExtra(data)
}

export async function updateCatalogueExtraAction(
  id: string,
  input: ExtraFormInput,
): Promise<DomainExtra> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data, error } = await supabase
    .from("catalogue_extras")
    .update({
      label: input.label.trim(),
      description: input.description.trim(),
      price_eur: input.priceEur,
      category: input.category,
      visible: input.visible,
      vat_percent: input.vatPercent,
    })
    .eq("id", id)
    .eq("domain_id", domainId)
    .select("*")
    .single()

  if (error) {
    console.error("[updateCatalogueExtraAction]", error.message)
    throw new Error("Impossible de modifier l'extra.")
  }

  revalidateCataloguePages()
  return rowToDomainExtra(data)
}

export async function deleteCatalogueExtraAction(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { error } = await supabase
    .from("catalogue_extras")
    .delete()
    .eq("id", id)
    .eq("domain_id", domainId)

  if (error) {
    console.error("[deleteCatalogueExtraAction]", error.message)
    throw new Error("Impossible de supprimer l'extra.")
  }

  revalidateCataloguePages()
}

export async function updateCatalogueExtraVisibleAction(
  id: string,
  visible: boolean,
): Promise<DomainExtra> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data, error } = await supabase
    .from("catalogue_extras")
    .update({ visible })
    .eq("id", id)
    .eq("domain_id", domainId)
    .select("*")
    .single()

  if (error) {
    console.error("[updateCatalogueExtraVisibleAction]", error.message)
    throw new Error("Impossible de mettre à jour la visibilité.")
  }

  revalidateCataloguePages()
  return rowToDomainExtra(data)
}
