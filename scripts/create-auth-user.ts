/**
 * Crée un utilisateur Supabase Auth + profil lié au domaine Venqor.
 *
 * Usage:
 *   npx tsx scripts/create-auth-user.ts votre@email.fr MotDePasseSecurise123
 */
import { config } from "dotenv"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "../lib/supabase/database.types"

config({ path: resolve(process.cwd(), ".env.local") })

const email = process.argv[2]?.trim()
const password = process.argv[3]

if (!email || !password) {
  console.error(`
Usage: npx tsx scripts/create-auth-user.ts <email> <mot-de-passe>

Exemple:
  npx tsx scripts/create-auth-user.ts jeremie@exemple.fr MonMotDePasse123!
`)
  process.exit(1)
}

if (password.length < 8) {
  console.error("Le mot de passe doit faire au moins 8 caractères.")
  process.exit(1)
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const secret = process.env.SUPABASE_SECRET_KEY!
const domainId =
  process.env.VENQOR_DOMAIN_ID ?? "00000000-0000-0000-0000-000000000001"

const supabase = createClient<Database>(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function main() {
  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: email.split("@")[0] },
    })

  if (createError) {
    throw new Error(createError.message)
  }

  const userId = created.user?.id
  if (!userId) {
    throw new Error("Utilisateur créé mais ID manquant.")
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      domain_id: domainId,
      full_name: email.split("@")[0],
      role: "admin",
    },
    { onConflict: "id" },
  )

  if (profileError) {
    console.warn(
      "⚠ Utilisateur créé, mais profil non enregistré:",
      profileError.message,
    )
    console.warn("  (La connexion peut quand même fonctionner pour la V1.)")
  }

  console.log("\n✓ Compte créé avec succès")
  console.log("  Email   :", email)
  console.log("  User ID :", userId)
  console.log("  Domaine :", domainId)
  console.log("\nConnectez-vous sur : https://acceuil.venqor.app/login\n")
}

main().catch((err) => {
  console.error("\n✗", err instanceof Error ? err.message : err)
  process.exit(1)
})
