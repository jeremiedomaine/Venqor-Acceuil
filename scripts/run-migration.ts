/**
 * Applique les fichiers supabase/migrations/*.sql (ordre alphabétique).
 * - Si DATABASE_URL est défini : exécution directe via postgres
 * - Sinon : affiche les instructions pour le SQL Editor Supabase
 */
import { config } from "dotenv"
import { readFileSync, readdirSync } from "fs"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env.local") })

const migrationsDir = resolve(process.cwd(), "supabase/migrations")
const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort()

const databaseUrl = process.env.DATABASE_URL?.trim()

async function runWithPostgres() {
  const postgres = await import("postgres")
  const sqlClient = postgres.default(databaseUrl!, { max: 1 })
  try {
    for (const file of files) {
      const sql = readFileSync(resolve(migrationsDir, file), "utf8")
      await sqlClient.unsafe(sql)
      console.log(`✓ ${file}`)
    }
    console.log("\n✓ Toutes les migrations appliquées via DATABASE_URL")
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
║  Migrations Supabase — action manuelle requise                   ║
╚══════════════════════════════════════════════════════════════════╝

Exécute chaque fichier dans supabase/migrations/ (ordre alphabétique) :

${files.map((f) => `  • ${f}`).join("\n")}

1. SQL Editor : https://supabase.com/dashboard/project/_/sql/new
2. Colle le contenu de chaque fichier → Run
3. Puis : npm run db:seed

Option : DATABASE_URL dans .env.local → npm run db:migrate
`)
}

main().catch((err) => {
  console.error("✗", err instanceof Error ? err.message : err)
  process.exit(1)
})
