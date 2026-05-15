import type { Database } from "@/lib/supabase/database.types"
import type {
  BookingStatus,
  DomainEventRecord,
  DomainEventType,
} from "@/lib/domain-events"

export type DomainEventRow =
  Database["public"]["Tables"]["domain_events"]["Row"]

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
  }
}

export function domainEventToInsert(
  domainId: string,
  event: DomainEventRecord,
  notes?: string | null,
): Database["public"]["Tables"]["domain_events"]["Insert"] {
  return {
    domain_id: domainId,
    legacy_id: /^ev-\d{1,4}$/.test(event.id) ? event.id : null,
    title: event.title,
    type: event.type,
    date_start: event.dateStart,
    date_end: event.dateEnd,
    guest_count: event.guestCount,
    booking_status: event.bookingStatus,
    client_or_org: event.clientOrOrg,
    notes: notes ?? null,
  }
}
