"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { provisionDomainForUser } from "@/lib/domain/provision"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export type OnboardingState = {
  error?: string
}

export async function createMyDomainAction(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const name = String(formData.get("name") ?? "").trim()
  const address = String(formData.get("address") ?? "").trim()

  if (!name) {
    return { error: "Indiquez le nom de votre domaine ou établissement." }
  }

  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Session expirée. Reconnectez-vous." }
  }

  const { data: existing } = await supabase
    .from("profiles")
    .select("domain_id")
    .eq("id", user.id)
    .maybeSingle()

  if (existing?.domain_id) {
    redirect("/")
  }

  try {
    await provisionDomainForUser({
      userId: user.id,
      name,
      address: address || null,
      fullName:
        (user.user_metadata?.full_name as string | undefined) ||
        user.email?.split("@")[0] ||
        null,
    })
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Création impossible.",
    }
  }

  revalidatePath("/", "layout")
  redirect("/")
}
