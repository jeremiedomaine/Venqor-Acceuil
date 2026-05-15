import type { Database } from "@/lib/supabase/database.types"
import type {
  BookingStatus,
  DomainEventRecord,
  DomainEventType,
} from "@/lib/domain-events"
import { mapFormTypeToDomainType } from "@/lib/domain-events-store"

export type DomainEventRow =
  Database["public"]["Tables"]["domain_events"]["Row"]

export type EventFormInput = {
  title: string
  eventType: string
  dateStart: string
  dateEnd?: string
  guests: number
  clientOrOrg: string
  bookingStatus: BookingStatus
  notes?: string
}

export function rowToDomainEvent(row: DomainEventRow): DomainEventRecord {
  return {
    id: row.id,
    title: row.title,
    type: row.type as DomainEventType,
    dateStart: row.date_start,
    dateEnd: row.date_end,
    guestCount: row.guest_count,
    bookingStatus: row.booking_status as BookingStatus,
    clientOrOrg: row.client_or_org,
    notes: row.notes,
  }
}

export function formInputToDomainFields(input: EventFormInput) {
  const dateEnd = input.dateEnd?.trim() || input.dateStart
  return {
    title: input.title.trim(),
    type: mapFormTypeToDomainType(input.eventType),
    date_start: input.dateStart,
    date_end: dateEnd,
    guest_count: input.guests,
    booking_status: input.bookingStatus,
    client_or_org: input.clientOrOrg.trim() || "Client non renseigné",
    notes: input.notes?.trim() || null,
  }
}

export function recordToFormInput(event: DomainEventRecord): EventFormInput {
  return {
    title: event.title,
    eventType: event.type,
    dateStart: event.dateStart,
    dateEnd: event.dateEnd,
    guests: event.guestCount,
    clientOrOrg: event.clientOrOrg,
    bookingStatus: event.bookingStatus,
    notes: event.notes ?? "",
  }
}

export function emptyEventFormInput(): EventFormInput {
  return {
    title: "",
    eventType: "Mariage",
    dateStart: "",
    dateEnd: "",
    guests: 0,
    clientOrOrg: "",
    bookingStatus: "Option",
    notes: "",
  }
}

export function domainEventToInsert(
  domainId: string,
  input: EventFormInput,
): Database["public"]["Tables"]["domain_events"]["Insert"] {
  const fields = formInputToDomainFields(input)
  return {
    domain_id: domainId,
    ...fields,
  }
}
