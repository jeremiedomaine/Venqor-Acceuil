import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { CreateDomainForm } from "@/components/onboarding/create-domain-form"
import { VenqorMark } from "@/components/auth/venqor-mark"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Créer votre espace – Venqor",
  description: "Configurez votre domaine Venqor.",
}

export default async function OnboardingPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("domain_id")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.domain_id) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <VenqorMark />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Bienvenue sur Venqor
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Créez l&apos;espace de votre établissement. Vous serez seul administrateur de
            cet espace — distinct des autres domaines sur la plateforme.
          </p>
        </div>

        <div className="rounded-md border border-border bg-card p-8 shadow-sm">
          <CreateDomainForm userEmail={user.email} />
        </div>
      </div>
    </div>
  )
}
