"use server"

import { revalidatePath } from "next/cache"
import {
  domainEventToInsert,
  rowToDomainEvent,
} from "@/lib/data/events"
import type { DomainEventRecord } from "@/lib/domain-events"
import { createDomainEventFromForm } from "@/lib/domain-events-store"
import { createAdminClient } from "@/lib/supabase/admin"
import { getVenqorDomainId } from "@/lib/supabase/env"

export async function listDomainEventsAction(): Promise<DomainEventRecord[]> {
  const supabase = createAdminClient()
  const domainId = getVenqorDomainId()

  const { data, error } = await supabase
    .from("domain_events")
    .select("*")
    .eq("domain_id", domainId)
    .order("date_start", { ascending: true })

  if (error) {
    console.error("[listDomainEventsAction]", error.message)
    throw new Error("Impossible de charger les événements.")
  }

  return (data ?? []).map(rowToDomainEvent)
}

export async function createDomainEventAction(input: {
  title: string
  eventType: string
  dateStart: string
  dateEnd?: string
  guests: number
  clientOrOrg: string
  notes?: string
}): Promise<DomainEventRecord> {
  const draft = createDomainEventFromForm(input)
  const supabase = createAdminClient()
  const domainId = getVenqorDomainId()

  const { data, error } = await supabase
    .from("domain_events")
    .insert(
      domainEventToInsert(domainId, draft, input.notes?.trim() || null),
    )
    .select("*")
    .single()

  if (error) {
    console.error("[createDomainEventAction]", error.message)
    throw new Error("Impossible de créer l'événement.")
  }

  revalidatePath("/")
  revalidatePath("/evenements")

  return rowToDomainEvent(data)
}

export async function countUniqueClientsAction(): Promise<number> {
  const events = await listDomainEventsAction()
  const names = new Set(
    events.map((e) => e.clientOrOrg.trim().toLowerCase()).filter(Boolean),
  )
  return names.size
}
