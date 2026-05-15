/**
 * Exécute un fichier SQL via DATABASE_URL (Supabase → Settings → Database → URI).
 * Usage: npx tsx scripts/apply-sql.ts supabase/migrations/002_domains_select_policy.sql
 */
import { config } from "dotenv"
import { readFileSync } from "fs"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env.local") })

const file = process.argv[2]
const databaseUrl = process.env.DATABASE_URL?.trim()

if (!file || !databaseUrl) {
  console.error(
    "Usage: DATABASE_URL dans .env.local + npx tsx scripts/apply-sql.ts <fichier.sql>",
  )
  process.exit(1)
}

const sql = readFileSync(resolve(process.cwd(), file), "utf8")

async function main() {
  const postgres = await import("postgres")
  const sqlClient = postgres.default(databaseUrl, { max: 1 })
  try {
    await sqlClient.unsafe(sql)
    console.log(`✓ ${file}`)
  } finally {
    await sqlClient.end()
  }
}

main().catch((err) => {
  console.error("✗", err instanceof Error ? err.message : err)
  process.exit(1)
})
