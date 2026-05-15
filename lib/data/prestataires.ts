import type { Database } from "@/lib/supabase/database.types"
import type {
  PrestataireCategory,
  PrestataireRecord,
  PrestataireStatus,
} from "@/lib/prestataires"

export type PrestataireRow = Database["public"]["Tables"]["prestataires"]["Row"]

export type PrestataireFormInput = {
  name: string
  category: PrestataireCategory
  contactName: string
  email: string
  phone: string
  status: PrestataireStatus
  eventsLinked: number
  lastOrNextMission: string
}

export const PRESTATAIRE_CATEGORIES: PrestataireCategory[] = [
  "Traiteur",
  "Photographie",
  "Musique / DJ",
  "Fleuriste",
  "Location matériel",
  "Chapiteau",
  "Sécurité",
  "Transport",
  "Coordination",
  "Autre",
]

export const PRESTATAIRE_STATUS_OPTIONS: PrestataireStatus[] = [
  "Actif",
  "Suspendu",
  "En attente",
]

export function rowToPrestataire(row: PrestataireRow): PrestataireRecord {
  return {
    id: row.id,
    name: row.name,
    category: row.category as PrestataireCategory,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone,
    status: row.status as PrestataireStatus,
    eventsLinked: row.events_linked,
    lastOrNextMission: row.last_or_next_mission,
  }
}

export function prestataireFormToFields(input: PrestataireFormInput) {
  return {
    name: input.name.trim(),
    category: input.category,
    contact_name: input.contactName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    status: input.status,
    events_linked: Math.max(0, input.eventsLinked),
    last_or_next_mission: input.lastOrNextMission.trim(),
  }
}

export function recordToPrestataireFormInput(p: PrestataireRecord): PrestataireFormInput {
  return {
    name: p.name,
    category: p.category,
    contactName: p.contactName,
    email: p.email,
    phone: p.phone,
    status: p.status,
    eventsLinked: p.eventsLinked,
    lastOrNextMission: p.lastOrNextMission,
  }
}

export function emptyPrestataireFormInput(): PrestataireFormInput {
  return {
    name: "",
    category: "Traiteur",
    contactName: "",
    email: "",
    phone: "",
    status: "Actif",
    eventsLinked: 0,
    lastOrNextMission: "",
  }
}

export function prestataireToInsert(
  domainId: string,
  input: PrestataireFormInput,
): Database["public"]["Tables"]["prestataires"]["Insert"] {
  return {
    domain_id: domainId,
    ...prestataireFormToFields(input),
  }
}
