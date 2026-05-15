"use server"

import { revalidatePath } from "next/cache"
import {
  appFormToUpdateFields,
  appToInsert,
  rowToDomainApp,
  type DomainAppFormInput,
} from "@/lib/data/domain-apps"
import { getCurrentDomain, requireDomainId } from "@/lib/domain/server"
import type { DomainApp, DomainAppStatus } from "@/lib/domain-apps"
import { createServerSupabaseClient } from "@/lib/supabase/server"

function revalidateAppPages() {
  revalidatePath("/mes-apps")
  revalidatePath("/")
}

export async function listDomainAppsAction(): Promise<DomainApp[]> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data, error } = await supabase
    .from("domain_apps")
    .select("*")
    .eq("domain_id", domainId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[listDomainAppsAction]", error.message)
    throw new Error("Impossible de charger les applications.")
  }

  return (data ?? []).map(rowToDomainApp)
}

export async function createDomainAppAction(
  input: DomainAppFormInput,
): Promise<DomainApp> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()
  const domain = await getCurrentDomain()

  const { data, error } = await supabase
    .from("domain_apps")
    .insert(appToInsert(domainId, domain.slug, input))
    .select("*")
    .single()

  if (error) {
    console.error("[createDomainAppAction]", error.message)
    if (error.message.includes("unique")) {
      throw new Error("Ce sous-domaine existe déjà pour votre espace.")
    }
    throw new Error("Impossible de créer l'application.")
  }

  revalidateAppPages()
  return rowToDomainApp(data)
}

export async function updateDomainAppAction(
  id: string,
  input: DomainAppFormInput,
): Promise<DomainApp> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()
  const domain = await getCurrentDomain()

  const { data, error } = await supabase
    .from("domain_apps")
    .update(appFormToUpdateFields(domain.slug, input))
    .eq("id", id)
    .eq("domain_id", domainId)
    .select("*")
    .single()

  if (error) {
    console.error("[updateDomainAppAction]", error.message)
    throw new Error("Impossible de modifier l'application.")
  }

  revalidateAppPages()
  return rowToDomainApp(data)
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
    throw new Error("Impossible de supprimer l'application.")
  }

  revalidateAppPages()
}

export async function updateDomainAppStatusAction(
  id: string,
  status: DomainAppStatus,
): Promise<DomainApp> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

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

  revalidateAppPages()
  return rowToDomainApp(data)
}

export async function countActiveDomainAppsAction(): Promise<number> {
  const apps = await listDomainAppsAction()
  return apps.filter((a) => a.status === "Actif").length
}
