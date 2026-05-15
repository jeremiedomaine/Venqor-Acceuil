"use client"

import { useActionState, useEffect, useState } from "react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import Link from "next/link"
import { ArrowRight, Loader2, Mail, Lock, Sparkles } from "lucide-react"
import {
  signInAction,
  resetPasswordAction,
  type AuthActionState,
} from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initial: AuthActionState = {}

type LoginFormProps = {
  nextPath: string
  callbackError?: boolean
  signedOut?: boolean
}

export function LoginForm({ nextPath, callbackError, signedOut }: LoginFormProps) {
  const [mode, setMode] = useState<"signin" | "forgot">("signin")
  const [signInState, signInFormAction, signInPending] = useActionState(
    signInAction,
    initial,
  )
  const [resetState, resetFormAction, resetPending] = useActionState(
    resetPasswordAction,
    initial,
  )

  const pending = signInPending || resetPending
  const state = mode === "signin" ? signInState : resetState

  useEffect(() => {
    if (!signedOut) return
    const supabase = createBrowserSupabaseClient()
    void supabase.auth.signOut()
  }, [signedOut])

  return (
    <div className="w-full max-w-[400px]">
      <div className="mb-8 lg:hidden">
        <p className="text-sm font-semibold text-primary">Venqor</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          Connexion
        </h1>
      </div>

      <div className="rounded-md border border-border bg-card p-8 shadow-sm ring-1 ring-black/[0.03]">
        <div className="mb-6">
          <h2 className="hidden text-xl font-bold tracking-tight text-foreground lg:block">
            {mode === "signin" ? "Connexion" : "Mot de passe oublié"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Accédez au tableau de bord de votre domaine."
              : "Nous vous enverrons un lien de réinitialisation par email."}
          </p>
        </div>

        {signedOut ? (
          <p
            className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
            role="status"
          >
            Vous êtes déconnecté.
          </p>
        ) : null}

        {callbackError ? (
          <p
            className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
            role="alert"
          >
            La session n&apos;a pas pu être établie. Réessayez de vous connecter.
          </p>
        ) : null}

        {state.error ? (
          <p
            className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}

        {state.success ? (
          <p
            className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
            role="status"
          >
            {state.success}
          </p>
        ) : null}

        {mode === "signin" ? (
          <form action={signInFormAction} className="space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="vous@domaine.fr"
                  required
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" className="w-full gap-2" disabled={pending}>
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="size-4" />
              )}
              {pending ? "Connexion…" : "Se connecter"}
            </Button>
          </form>
        ) : (
          <form action={resetFormAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="vous@domaine.fr"
                  required
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" variant="outline" className="w-full" disabled={pending}>
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Envoyer le lien
            </Button>
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              ← Retour à la connexion
            </button>
          </form>
        )}

        <p className="mt-6 flex items-start gap-2 rounded-md bg-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
          <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
          Accès réservé aux opérateurs Venqor. Besoin d&apos;un compte ? Contactez votre
          administrateur.
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link
          href="https://venqor.app"
          className="font-medium text-foreground/80 hover:text-primary"
        >
          ← Retour à venqor.app
        </Link>
      </p>
    </div>
  )
}
