import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DomainErrorCode } from "@/lib/domain/types"

export function DomainSetupRequired({
  code,
  message,
}: {
  code: DomainErrorCode
  message: string
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md rounded-md border border-border bg-card p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto size-10 text-amber-600" aria-hidden />
        <h1 className="mt-4 text-lg font-semibold text-foreground">
          Configuration du domaine requise
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        {code === "NO_PROFILE" && (
          <p className="mt-3 text-xs text-muted-foreground">
            Un administrateur doit créer votre compte avec{" "}
            <code className="rounded bg-muted px-1 py-0.5">npm run auth:create-user</code>{" "}
            en précisant le slug du domaine.
          </p>
        )}
        <Button asChild className="mt-6" variant="outline">
          <Link href="/login">Retour à la connexion</Link>
        </Button>
      </div>
    </main>
  )
}
