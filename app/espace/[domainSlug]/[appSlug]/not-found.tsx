import Link from "next/link"
import { Heart } from "lucide-react"

export default function WeddingPortalNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Heart className="h-7 w-7" aria-hidden />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
        Espace introuvable
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Ce lien n&apos;est plus actif ou l&apos;espace n&apos;a pas encore été publié par le domaine.
        Contactez votre lieu de réception pour obtenir le bon lien.
      </p>
      <Link
        href="/login"
        className="mt-8 text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Accéder au portail Venqor
      </Link>
    </div>
  )
}
