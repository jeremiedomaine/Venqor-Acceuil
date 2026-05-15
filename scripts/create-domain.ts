/**
 * Crée ou met à jour un domaine (tenant) Venqor.
 *
 * Usage:
 *   npm run domain:create -- <slug> "<Nom affiché>" ["Adresse"]
 *
 * Exemple:
 *   npm run domain:create -- chateau-mirabel "Château de Mirabel" "Dordogne, France"
 */
import { config } from "dotenv"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "../lib/supabase/database.types"

config({ path: resolve(process.cwd(), ".env.local") })

const slug = process.argv[2]?.trim().toLowerCase()
const name = process.argv[3]?.trim()
const address = process.argv[4]?.trim() || null

if (!slug || !name) {
  console.error(`
Usage: npm run domain:create -- <slug> "<nom>" ["adresse"]

Exemple:
  npm run domain:create -- chateau-mirabel "Château de Mirabel" "Dordogne"
`)
  process.exit(1)
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Le slug doit être en minuscules, chiffres et tirets uniquement.")
  process.exit(1)
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const secret = process.env.SUPABASE_SECRET_KEY!

const supabase = createClient<Database>(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function main() {
  const { data: existing } = await supabase
    .from("domains")
    .select("id, slug, name")
    .eq("slug", slug)
    .maybeSingle()

  if (existing) {
    const { data, error } = await supabase
      .from("domains")
      .update({ name, address })
      .eq("id", existing.id)
      .select("id, slug, name, address")
      .single()

    if (error) throw new Error(error.message)

    console.log("\n✓ Domaine mis à jour")
    console.log("  ID    :", data.id)
    console.log("  Slug  :", data.slug)
    console.log("  Nom   :", data.name)
    console.log("\nCréer un utilisateur :")
    console.log(`  npm run auth:create-user -- email@exemple.fr MotDePasse123! ${data.slug}\n`)
    return
  }

  const { data, error } = await supabase
    .from("domains")
    .insert({ slug, name, address })
    .select("id, slug, name, address")
    .single()

  if (error) throw new Error(error.message)

  console.log("\n✓ Domaine créé")
  console.log("  ID    :", data.id)
  console.log("  Slug  :", data.slug)
  console.log("  Nom   :", data.name)
  console.log("\nÉtapes suivantes :")
  console.log("  1. npm run db:seed   (optionnel, données démo pour ce domain_id en .env)")
  console.log("  2. npm run auth:create-user -- <email> <mdp> " + data.slug)
  console.log("\nSous-apps : {app}." + data.slug + ".venqor.app\n")
}

main().catch((err) => {
  console.error("\n✗", err instanceof Error ? err.message : err)
  process.exit(1)
})
