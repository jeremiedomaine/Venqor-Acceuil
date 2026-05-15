"use server"

import { revalidatePath } from "next/cache"
import {
  domainEventToInsert,
  formInputToDomainFields,
  rowToDomainEvent,
  type EventFormInput,
} from "@/lib/data/events"
import { requireDomainId } from "@/lib/domain/server"
import type { BookingStatus, DomainEventRecord } from "@/lib/domain-events"
import { createServerSupabaseClient } from "@/lib/supabase/server"

function revalidateEventPages() {
  revalidatePath("/")
  revalidatePath("/evenements")
}

export async function listDomainEventsAction(): Promise<DomainEventRecord[]> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data, error } = await supabase
    .from("domain_events")
    .select("*")
    .eq("domain_id", domainId)
    .order("date_start", { ascending: false })

  if (error) {
    console.error("[listDomainEventsAction]", error.message)
    throw new Error("Impossible de charger les événements.")
  }

  return (data ?? []).map(rowToDomainEvent)
}

export async function createDomainEventAction(
  input: EventFormInput,
): Promise<DomainEventRecord> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data, error } = await supabase
    .from("domain_events")
    .insert(domainEventToInsert(domainId, input))
    .select("*")
    .single()

  if (error) {
    console.error("[createDomainEventAction]", error.message)
    throw new Error("Impossible de créer l'événement.")
  }

  revalidateEventPages()
  return rowToDomainEvent(data)
}

export async function updateDomainEventAction(
  id: string,
  input: EventFormInput,
): Promise<DomainEventRecord> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()
  const fields = formInputToDomainFields(input)

  const { data, error } = await supabase
    .from("domain_events")
    .update(fields)
    .eq("id", id)
    .eq("domain_id", domainId)
    .select("*")
    .single()

  if (error) {
    console.error("[updateDomainEventAction]", error.message)
    throw new Error("Impossible de modifier l'événement.")
  }

  revalidateEventPages()
  return rowToDomainEvent(data)
}

export async function deleteDomainEventAction(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { error } = await supabase
    .from("domain_events")
    .delete()
    .eq("id", id)
    .eq("domain_id", domainId)

  if (error) {
    console.error("[deleteDomainEventAction]", error.message)
    throw new Error("Impossible de supprimer l'événement.")
  }

  revalidateEventPages()
}

export async function updateEventBookingStatusAction(
  id: string,
  bookingStatus: BookingStatus,
): Promise<DomainEventRecord> {
  const supabase = await createServerSupabaseClient()
  const domainId = await requireDomainId()

  const { data, error } = await supabase
    .from("domain_events")
    .update({ booking_status: bookingStatus })
    .eq("id", id)
    .eq("domain_id", domainId)
    .select("*")
    .single()

  if (error) {
    console.error("[updateEventBookingStatusAction]", error.message)
    throw new Error("Impossible de mettre à jour le statut.")
  }

  revalidateEventPages()
  return rowToDomainEvent(data)
}

export async function countUniqueClientsAction(): Promise<number> {
  const events = await listDomainEventsAction()
  const names = new Set(
    events.map((e) => e.clientOrOrg.trim().toLowerCase()).filter(Boolean),
  )
  return names.size
}
