/**
 * Lie tous les comptes Auth existants au domaine VENQOR_DOMAIN_ID.
 * ⚠️ À utiliser seulement pour rattacher des opérateurs à un domaine EXISTANT
 * (ex. Lauri-Bastide). Ne pas utiliser pour de nouveaux clients : ils passent
 * par /onboarding et obtiennent leur propre espace.
 */
import { config } from "dotenv"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "../lib/supabase/database.types"

config({ path: resolve(process.cwd(), ".env.local") })

const domainId =
  process.env.VENQOR_DOMAIN_ID ?? "00000000-0000-0000-0000-000000000001"

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

async function main() {
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 200 })
  if (error) throw new Error(error.message)

  const users = data.users ?? []
  console.log(`${users.length} utilisateur(s) Auth trouvé(s)\n`)

  if (users.length === 0) {
    console.log("Aucun compte. Créez-en un avec :")
    console.log("  npm run auth:create-user -- votre@email.fr MotDePasse123! lauri-bastide\n")
    return
  }

  for (const user of users) {
    const { error: profileError } = await supabase.from("profiles").upsert(
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
    if (profileError) {
      console.log(`✗ ${user.email}: ${profileError.message}`)
    } else {
      console.log(`✓ ${user.email} → domaine ${domainId}`)
    }
  }
}

main().catch((err) => {
  console.error("✗", err instanceof Error ? err.message : err)
  process.exit(1)
})
