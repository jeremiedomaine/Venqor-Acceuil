/**
 * Crée un utilisateur Supabase Auth + profil lié à un domaine Venqor.
 *
 * Usage:
 *   npm run auth:create-user -- <email> <mot-de-passe> [slug-domaine]
 *
 * Utilisez un slug pour rattacher l'utilisateur à un domaine DÉJÀ existant.
 * Pour un nouvel espace isolé : créez le compte dans Supabase Auth, l'utilisateur
 * complétera /onboarding à la première connexion.
 */
import { config } from "dotenv"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "../lib/supabase/database.types"

config({ path: resolve(process.cwd(), ".env.local") })

const email = process.argv[2]?.trim()
const password = process.argv[3]
const domainSlug =
  process.argv[4]?.trim() ||
  process.env.VENQOR_DOMAIN_SLUG?.trim() ||
  "lauri-bastide"

if (!email || !password) {
  console.error(`
Usage: npm run auth:create-user -- <email> <mot-de-passe> [slug-domaine]

Exemple:
  npm run auth:create-user -- jeremie@exemple.fr MonMotDePasse123! lauri-bastide
`)
  process.exit(1)
}

if (password.length < 8) {
  console.error("Le mot de passe doit faire au moins 8 caractères.")
  process.exit(1)
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const secret = process.env.SUPABASE_SECRET_KEY!

const supabase = createClient<Database>(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function resolveDomainId(): Promise<string> {
  const { data, error } = await supabase
    .from("domains")
    .select("id, slug, name")
    .eq("slug", domainSlug)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) {
    throw new Error(
      `Domaine "${domainSlug}" introuvable. Créez-le avec : npm run domain:create -- ${domainSlug} "Nom du domaine"`,
    )
  }

  console.log(`  Domaine : ${data.name} (${data.slug})`)
  return data.id
}

async function main() {
  const domainId = await resolveDomainId()

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
    console.warn("  Sans profil, l'app affichera « Configuration du domaine requise ».")
  }

  console.log("\n✓ Compte créé avec succès")
  console.log("  Email   :", email)
  console.log("  User ID :", userId)
  console.log("  Slug    :", domainSlug)
  console.log("\nConnectez-vous sur : https://acceuil.venqor.app/login\n")
}

main().catch((err) => {
  console.error("\n✗", err instanceof Error ? err.message : err)
  process.exit(1)
})
