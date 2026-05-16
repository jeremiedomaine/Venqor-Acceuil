/**
 * Importe les données de démo dans Supabase (domaine + événements + catalogue + prestataires + apps).
 * Prérequis : npm run db:migrate
 */
import { config } from "dotenv"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "../lib/supabase/database.types"
import { DOMAIN_EVENTS_SEED } from "../lib/domain-events"
import {
  DEFAULT_CATALOGUE_CONFIG,
  DOMAIN_EXTRAS_SEED,
} from "../lib/domain-extras"
import { DOMAIN_APPS_SEED } from "../lib/domain-apps"
import { DOMAIN_PRESTATAIRES } from "../lib/prestataires"
import { domainEventToInsert } from "../lib/data/events"

config({ path: resolve(process.cwd(), ".env.local") })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const secret = process.env.SUPABASE_SECRET_KEY!
const domainId =
  process.env.VENQOR_DOMAIN_ID ?? "00000000-0000-0000-0000-000000000001"
const domainSlug = process.env.VENQOR_DOMAIN_SLUG ?? "lauri-bastide"

const supabase = createClient<Database>(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function main() {
  console.log("→ Domaine…")
  const { error: domainError } = await supabase.from("domains").upsert(
    {
      id: domainId,
      slug: domainSlug,
      name: "Domaine des lauriers de la Bastide",
      address: "Route de la Bastide, Tarn",
      cover_image_url: "https://zupimages.net/up/26/17/enyx.jpeg",
    },
    { onConflict: "id" },
  )
  if (domainError) throw new Error(`domains: ${domainError.message}`)

  const { count: eventCount } = await supabase
    .from("domain_events")
    .select("*", { count: "exact", head: true })
    .eq("domain_id", domainId)

  if ((eventCount ?? 0) === 0) {
    console.log(`→ ${DOMAIN_EVENTS_SEED.length} événements…`)
    const eventRows = DOMAIN_EVENTS_SEED.map((e) => ({
      ...domainEventToInsert(domainId, e),
      legacy_id: e.id,
    }))
    const { error: eventsError } = await supabase
      .from("domain_events")
      .insert(eventRows)
    if (eventsError) throw new Error(`domain_events: ${eventsError.message}`)
  } else {
    console.log(`→ Événements déjà présents (${eventCount}), skip.`)
  }

  const { count: extrasCount } = await supabase
    .from("catalogue_extras")
    .select("*", { count: "exact", head: true })
    .eq("domain_id", domainId)

  if ((extrasCount ?? 0) === 0) {
    console.log(`→ ${DOMAIN_EXTRAS_SEED.length} extras catalogue…`)
    const { error: extrasError } = await supabase.from("catalogue_extras").insert(
      DOMAIN_EXTRAS_SEED.map((x, i) => ({
        domain_id: domainId,
        legacy_id: x.id,
        label: x.label,
        description: x.description,
        price_eur: x.priceEur,
        category: x.category,
        visible: x.visible,
        vat_percent: x.vatPercent,
        sort_order: i,
      })),
    )
    if (extrasError) throw new Error(`catalogue_extras: ${extrasError.message}`)
  }

  const { error: configError } = await supabase.from("catalogue_config").upsert(
    {
      domain_id: domainId,
      show_ttc_by_default: DEFAULT_CATALOGUE_CONFIG.showTtcByDefault,
      intro_client: DEFAULT_CATALOGUE_CONFIG.introClient,
      min_lead_days: DEFAULT_CATALOGUE_CONFIG.minLeadDays,
      guest_booking_allowed: DEFAULT_CATALOGUE_CONFIG.guestBookingAllowed,
      platform_fee_percent: DEFAULT_CATALOGUE_CONFIG.platformFeePercent,
    },
    { onConflict: "domain_id" },
  )
  if (configError) throw new Error(`catalogue_config: ${configError.message}`)

  const { count: prestCount } = await supabase
    .from("prestataires")
    .select("*", { count: "exact", head: true })
    .eq("domain_id", domainId)

  if ((prestCount ?? 0) === 0) {
    console.log(`→ ${DOMAIN_PRESTATAIRES.length} prestataires…`)
    const { error: prestError } = await supabase.from("prestataires").insert(
      DOMAIN_PRESTATAIRES.map((p) => ({
        domain_id: domainId,
        legacy_id: p.id,
        name: p.name,
        category: p.category,
        contact_name: p.contactName,
        email: p.email,
        phone: p.phone,
        status: p.status,
        events_linked: p.eventsLinked,
        last_or_next_mission: p.lastOrNextMission,
      })),
    )
    if (prestError) throw new Error(`prestataires: ${prestError.message}`)
  }

  console.log(`→ ${DOMAIN_APPS_SEED.length} espaces mariés (sync démo)…`)
  const { error: appsError } = await supabase.from("domain_apps").upsert(
    DOMAIN_APPS_SEED.map((a) => ({
      domain_id: domainId,
      legacy_id: a.slug,
      label: a.label,
      slug: a.slug,
      host: a.host,
      status: a.status,
      description: a.description,
      created_at: a.createdAt,
      partner_one: a.partnerOne,
      partner_two: a.partnerTwo,
      wedding_date: a.weddingDate,
      welcome_message: a.welcomeMessage,
    })),
    { onConflict: "domain_id,slug" },
  )
  if (appsError) throw new Error(`domain_apps: ${appsError.message}`)

  console.log("\n✓ Seed terminé pour le domaine", domainSlug)
}

main().catch((err) => {
  console.error("\n✗", err instanceof Error ? err.message : err)
  process.exit(1)
})
