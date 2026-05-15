"use client"

import { useActionState } from "react"
import { Building2, Loader2, MapPin } from "lucide-react"
import {
  createMyDomainAction,
  type OnboardingState,
} from "@/app/actions/onboarding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initial: OnboardingState = {}

type CreateDomainFormProps = {
  userEmail?: string | null
}

export function CreateDomainForm({ userEmail }: CreateDomainFormProps) {
  const [state, formAction, pending] = useActionState(
    createMyDomainAction,
    initial,
  )

  return (
    <form action={formAction} className="space-y-5">
      {userEmail ? (
        <p className="text-sm text-muted-foreground">
          Compte : <span className="font-medium text-foreground">{userEmail}</span>
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="domain-name">Nom du domaine / établissement</Label>
        <div className="relative">
          <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="domain-name"
            name="name"
            required
            placeholder="Ex. Château de Mirabel, Domaine des Oliviers…"
            className="pl-10"
            autoFocus
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Un espace Venqor dédié sera créé (événements, catalogue, prestataires isolés des
          autres clients).
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain-address">Adresse (optionnel)</Label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="domain-address"
            name="address"
            placeholder="Ville, région…"
            className="pl-10"
          />
        </div>
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="w-full gap-2" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        {pending ? "Création de l'espace…" : "Créer mon espace"}
      </Button>
    </form>
  )
}
