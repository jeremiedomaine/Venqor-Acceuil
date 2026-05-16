"use server"

import { revalidatePath } from "next/cache"
import {
  rowToDomainApp,
  weddingAppFormToUpdateFields,
  weddingAppToInsert,
  type WeddingAppFormInput,
} from "@/lib/data/domain-apps"
import { getCurrentDomain, requireDomainId } from "@/lib/domain/server"
import type { DomainApp, DomainAppStatus } from "@/lib/domain-apps"
import { buildWeddingAppSlug } from "@/lib/wedding-apps"
import { createServerSupabaseClient } from "@/lib/supabase/server"

function revalidateAppPages(slug?: string, domainSlug?: string) {
  revalidatePath("/mes-apps")
  revalidatePath("/")
  if (slug && domainSlug) {
    revalidatePath(`/espace/${domainSlug}/${slug}`)
  }
}

async function ensureUniqueSlug(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  domainId: string,
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  let slug = baseSlug
  let attempt = 0

  while (attempt < 20) {
    let query = supabase
      .from("domain_apps")
      .select("id")
      .eq("domain_id", domainId)
      .eq("slug", slug)

    if (excludeId) {
      query = query.neq("id", excludeId)
    }

    const { data } = await query.maybeSingle()
    if (!data) return slug

    attempt += 1
    slug = `${baseSlug}-${attempt}`.slice(0, 56)
  }

  return `${baseSlug}-${Date.now().toString(36).slice(-4)}`.slice(0, 56)
}

export async function listDomainAppsAction(): Promise<DomainApp[]> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data, error } = await supabase
    .from("domain_apps")
    .select("*")
    .eq("domain_id", domainId)
    .order("wedding_date", { ascending: false })

  if (error) {
    console.error("[listDomainAppsAction]", error.message)
    throw new Error("Impossible de charger les espaces mariés.")
  }

  return (data ?? []).map(rowToDomainApp)
}

export async function createDomainAppAction(
  input: WeddingAppFormInput,
): Promise<DomainApp> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()
  const domain = await getCurrentDomain()

  const partnerOne = input.partnerOne.trim()
  const partnerTwo = input.partnerTwo.trim()
  const weddingDate = input.weddingDate.trim()

  if (!partnerOne || !partnerTwo || !weddingDate) {
    throw new Error("Renseignez les deux prénoms et la date du mariage.")
  }

  const baseSlug = buildWeddingAppSlug(partnerOne, partnerTwo, weddingDate)
  const uniqueSlug = await ensureUniqueSlug(supabase, domainId, baseSlug)

  const insertRow = weddingAppToInsert(domainId, domain.slug, {
    ...input,
    partnerOne,
    partnerTwo,
    weddingDate,
  })
  insertRow.slug = uniqueSlug
  insertRow.host = `${uniqueSlug}.${domain.slug}.venqor.app`

  const { data, error } = await supabase
    .from("domain_apps")
    .insert(insertRow)
    .select("*")
    .single()

  if (error) {
    console.error("[createDomainAppAction]", error.message)
    throw new Error("Impossible de créer l'espace mariés.")
  }

  const app = rowToDomainApp(data)
  revalidateAppPages(app.slug, domain.slug)
  return app
}

export async function updateDomainAppAction(
  id: string,
  input: WeddingAppFormInput,
): Promise<DomainApp> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()
  const domain = await getCurrentDomain()

  const partnerOne = input.partnerOne.trim()
  const partnerTwo = input.partnerTwo.trim()
  const weddingDate = input.weddingDate.trim()

  if (!partnerOne || !partnerTwo || !weddingDate) {
    throw new Error("Renseignez les deux prénoms et la date du mariage.")
  }

  const baseSlug = buildWeddingAppSlug(partnerOne, partnerTwo, weddingDate)
  const uniqueSlug = await ensureUniqueSlug(supabase, domainId, baseSlug, id)

  const updateFields = weddingAppFormToUpdateFields(domain.slug, {
    ...input,
    partnerOne,
    partnerTwo,
    weddingDate,
  })
  updateFields.slug = uniqueSlug
  updateFields.host = `${uniqueSlug}.${domain.slug}.venqor.app`

  const { data, error } = await supabase
    .from("domain_apps")
    .update(updateFields)
    .eq("id", id)
    .eq("domain_id", domainId)
    .select("*")
    .single()

  if (error) {
    console.error("[updateDomainAppAction]", error.message)
    throw new Error("Impossible de modifier l'espace mariés.")
  }

  const app = rowToDomainApp(data)
  revalidateAppPages(app.slug, domain.slug)
  return app
}

export async function deleteDomainAppAction(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { error } = await supabase
    .from("domain_apps")
    .delete()
    .eq("id", id)
    .eq("domain_id", domainId)

  if (error) {
    console.error("[deleteDomainAppAction]", error.message)
    throw new Error("Impossible de supprimer l'espace mariés.")
  }

  revalidateAppPages()
}

export async function updateDomainAppStatusAction(
  id: string,
  status: DomainAppStatus,
): Promise<DomainApp> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()
  const domain = await getCurrentDomain()

  const { data, error } = await supabase
    .from("domain_apps")
    .update({ status })
    .eq("id", id)
    .eq("domain_id", domainId)
    .select("*")
    .single()

  if (error) {
    console.error("[updateDomainAppStatusAction]", error.message)
    throw new Error("Impossible de mettre à jour le statut.")
  }

  const app = rowToDomainApp(data)
  revalidateAppPages(app.slug, domain.slug)
  return app
}

export async function countActiveDomainAppsAction(): Promise<number> {
  const apps = await listDomainAppsAction()
  return apps.filter((a) => a.status === "Actif").length
}
