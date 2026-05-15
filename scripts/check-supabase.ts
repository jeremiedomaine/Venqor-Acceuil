import { config } from "dotenv"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "../lib/supabase/database.types"

config({ path: resolve(process.cwd(), ".env.local") })

async function main() {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  )
  const domainId = process.env.VENQOR_DOMAIN_ID!

  const { data: domain } = await supabase
    .from("domains")
    .select("id, slug, name")
    .eq("id", domainId)
    .single()

  const { data: events, count } = await supabase
    .from("domain_events")
    .select("title, date_start, client_or_org, created_at", { count: "exact" })
    .eq("domain_id", domainId)
    .order("date_start", { ascending: false })

  console.log("Projet:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("Domaine:", domain)
  console.log("Nombre d'événements:", count)
  console.log("\nListe:")
  events?.forEach((e, i) => console.log(`  ${i + 1}. ${e.title} (${e.date_start})`))
}

main()
