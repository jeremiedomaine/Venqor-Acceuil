/**
 * Applique la migration 002 (si DATABASE_URL), met à jour le domaine Lauriers,
 * assure les profils utilisateurs, et lance le seed.
 */
import { config } from "dotenv"
import { readFileSync } from "fs"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "../lib/supabase/database.types"

config({ path: resolve(process.cwd(), ".env.local") })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const secret = process.env.SUPABASE_SECRET_KEY!
const domainId =
  process.env.VENQOR_DOMAIN_ID ?? "00000000-0000-0000-0000-000000000001"
const domainSlug = process.env.VENQOR_DOMAIN_SLUG ?? "lauri-bastide"

const supabase = createClient<Database>(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function applyMigration002() {
  const databaseUrl = process.env.DATABASE_URL?.trim()
  if (!databaseUrl) {
    console.log("→ Migration 002 : DATABASE_URL absent — à exécuter dans le SQL Editor")
    return false
  }

  const sql = readFileSync(
    resolve(process.cwd(), "supabase/migrations/002_domains_select_policy.sql"),
    "utf8",
  )
  const postgres = await import("postgres")
  const client = postgres.default(databaseUrl, { max: 1 })
  try {
    await client.unsafe(sql)
    console.log("✓ Migration 002 appliquée")
    return true
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes("already exists")) {
      console.log("✓ Migration 002 déjà présente")
      return true
    }
    throw err
  } finally {
    await client.end()
  }
}

async function upsertDomain() {
  const { data, error } = await supabase
    .from("domains")
    .upsert(
      {
        id: domainId,
        slug: domainSlug,
        name: "Domaine des lauriers de la Bastide",
        address: "La Jourdane, 81500 Giroussens",
        cover_image_url: "https://zupimages.net/up/26/17/enyx.jpeg",
      },
      { onConflict: "id" },
    )
    .select("id, slug, name")
    .single()

  if (error) throw new Error(`domains: ${error.message}`)
  console.log(`✓ Domaine : ${data.name} (${data.slug})`)
  return data
}

async function linkAllUsersToDomain() {
  const { data: list, error: listError } = await supabase.auth.admin.listUsers({
    perPage: 200,
  })
  if (listError) throw new Error(listError.message)

  const users = list.users ?? []
  if (users.length === 0) {
    console.log("→ Aucun utilisateur Auth — créez-en avec npm run auth:create-user")
    return
  }

  for (const user of users) {
    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        domain_id: domainId,
        full_name:
          (user.user_metadata?.full_name as string | undefined) ||
          user.email?.split("@")[0] ||
          "Opérateur",
        role: "admin",
      },
      { onConflict: "id" },
    )
    if (error) {
      console.warn(`  ⚠ Profil ${user.email}: ${error.message}`)
    } else {
      console.log(`  ✓ Profil lié : ${user.email}`)
    }
  }
}

async function main() {
  console.log("\n── Setup tenant Lauri-Bastide ──\n")
  await applyMigration002()
  await upsertDomain()
  await linkAllUsersToDomain()
  console.log("\n→ Lancement du seed…\n")
}

main()
  .then(() => {
    import("child_process").then(({ execSync }) => {
      execSync("npm run db:seed", { stdio: "inherit", cwd: process.cwd() })
    })
  })
  .catch((err) => {
    console.error("\n✗", err instanceof Error ? err.message : err)
    process.exit(1)
  })
