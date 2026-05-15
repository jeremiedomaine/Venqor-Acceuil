"use server"

import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export type AuthActionState = {
  error?: string
  success?: string
}

export async function signInAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Email et mot de passe requis." }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Email ou mot de passe incorrect." }
    }
    return { error: error.message }
  }

  const next = String(formData.get("next") ?? "/")
  redirect(next.startsWith("/") ? next : "/")
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function resetPasswordAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim()
  if (!email) {
    return { error: "Indiquez votre adresse email." }
  }

  const supabase = await createServerSupabaseClient()
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://acceuil.venqor.app"

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/login`,
  })

  if (error) {
    return { error: error.message }
  }

  return {
    success: "Si un compte existe, un email de réinitialisation vient d’être envoyé.",
  }
}
