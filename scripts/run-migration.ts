/**
 * Applique supabase/migrations/001_initial_schema.sql
 * - Si DATABASE_URL est défini : exécution directe via postgres
 * - Sinon : affiche les instructions pour le SQL Editor Supabase
 */
import { config } from "dotenv"
import { readFileSync } from "fs"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env.local") })

const migrationPath = resolve(
  process.cwd(),
  "supabase/migrations/001_initial_schema.sql",
)
const sql = readFileSync(migrationPath, "utf8")
const databaseUrl = process.env.DATABASE_URL?.trim()

async function runWithPostgres() {
  const postgres = await import("postgres")
  const sqlClient = postgres.default(databaseUrl!, { max: 1 })
  try {
    await sqlClient.unsafe(sql)
    console.log("✓ Migration appliquée via DATABASE_URL")
  } finally {
    await sqlClient.end()
  }
}

async function main() {
  if (databaseUrl) {
    await runWithPostgres()
    return
  }

  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  Migration Supabase — action manuelle requise                    ║
╚══════════════════════════════════════════════════════════════════╝

1. Ouvre le SQL Editor :
   https://supabase.com/dashboard/project/xumonescrukafotvlofn/sql/new

2. Colle le contenu du fichier :
   supabase/migrations/001_initial_schema.sql

3. Clique sur « Run »

4. Puis lance : npm run db:seed

Option : ajoute DATABASE_URL dans .env.local (Settings → Database → URI)
pour exécuter automatiquement : npm run db:migrate
`)
}

main().catch((err) => {
  console.error("✗", err instanceof Error ? err.message : err)
  process.exit(1)
})
