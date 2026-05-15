"use server"

import { revalidatePath } from "next/cache"
import {
  prestataireFormToFields,
  prestataireToInsert,
  rowToPrestataire,
  type PrestataireFormInput,
} from "@/lib/data/prestataires"
import { requireDomainId } from "@/lib/domain/server"
import type { PrestataireRecord, PrestataireStatus } from "@/lib/prestataires"
import { createServerSupabaseClient } from "@/lib/supabase/server"

function revalidatePrestatairePages() {
  revalidatePath("/prestataires")
  revalidatePath("/")
}

export async function listPrestatairesAction(): Promise<PrestataireRecord[]> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data, error } = await supabase
    .from("prestataires")
    .select("*")
    .eq("domain_id", domainId)
    .order("name", { ascending: true })

  if (error) {
    console.error("[listPrestatairesAction]", error.message)
    throw new Error("Impossible de charger les prestataires.")
  }

  return (data ?? []).map(rowToPrestataire)
}

export async function createPrestataireAction(
  input: PrestataireFormInput,
): Promise<PrestataireRecord> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data, error } = await supabase
    .from("prestataires")
    .insert(prestataireToInsert(domainId, input))
    .select("*")
    .single()

  if (error) {
    console.error("[createPrestataireAction]", error.message)
    throw new Error("Impossible de créer le prestataire.")
  }

  revalidatePrestatairePages()
  return rowToPrestataire(data)
}

export async function updatePrestataireAction(
  id: string,
  input: PrestataireFormInput,
): Promise<PrestataireRecord> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data, error } = await supabase
    .from("prestataires")
    .update(prestataireFormToFields(input))
    .eq("id", id)
    .eq("domain_id", domainId)
    .select("*")
    .single()

  if (error) {
    console.error("[updatePrestataireAction]", error.message)
    throw new Error("Impossible de modifier le prestataire.")
  }

  revalidatePrestatairePages()
  return rowToPrestataire(data)
}

export async function deletePrestataireAction(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { error } = await supabase
    .from("prestataires")
    .delete()
    .eq("id", id)
    .eq("domain_id", domainId)

  if (error) {
    console.error("[deletePrestataireAction]", error.message)
    throw new Error("Impossible de supprimer le prestataire.")
  }

  revalidatePrestatairePages()
}

export async function updatePrestataireStatusAction(
  id: string,
  status: PrestataireStatus,
): Promise<PrestataireRecord> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data, error } = await supabase
    .from("prestataires")
    .update({ status })
    .eq("id", id)
    .eq("domain_id", domainId)
    .select("*")
    .single()

  if (error) {
    console.error("[updatePrestataireStatusAction]", error.message)
    throw new Error("Impossible de mettre à jour le statut.")
  }

  revalidatePrestatairePages()
  return rowToPrestataire(data)
}

export async function countPrestatairesActifsAction(): Promise<number> {
  const list = await listPrestatairesAction()
  return list.filter((p) => p.status === "Actif").length
}
