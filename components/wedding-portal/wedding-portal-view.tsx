import { CalendarHeart, Heart, MapPin, Sparkles } from "lucide-react"
import type { PublicWeddingPortal } from "@/lib/data/wedding-portal"
import {
  formatCoupleNames,
  formatWeddingDateLong,
} from "@/lib/wedding-apps"

const FALLBACK_COVER =
  "https://zupimages.net/up/26/17/enyx.jpeg"

type WeddingPortalViewProps = {
  portal: PublicWeddingPortal
}

export function WeddingPortalView({ portal }: WeddingPortalViewProps) {
  const { domain, app } = portal
  const couple = formatCoupleNames(app.partnerOne, app.partnerTwo)
  const dateLong = formatWeddingDateLong(app.weddingDate)
  const cover = domain.coverImageUrl || FALLBACK_COVER
  const welcome =
    app.welcomeMessage?.trim() ||
    `Bienvenue dans votre espace privé. Toutes les informations pour préparer votre mariage chez ${domain.name} sont réunies ici.`

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <header className="relative min-h-[22rem] overflow-hidden sm:min-h-[26rem]">
        <img
          src={cover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-900/35 to-[#f6f8fc]" />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-16 pt-20 text-center sm:pt-24">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/75">
            {domain.name}
          </p>
          <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm">
            <Heart className="h-7 w-7 fill-white/90 stroke-white" aria-hidden />
          </div>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {couple}
          </h1>
          <p className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-white/90 sm:text-base">
            <CalendarHeart className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            {dateLong}
          </p>
          {domain.address ? (
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-white/80">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              {domain.address}
            </p>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-10 sm:px-8">
        <section className="rounded-2xl border border-border/70 bg-card p-8 shadow-sm shadow-slate-900/[0.04] sm:p-10">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-primary">
            <Sparkles className="h-4 w-4" aria-hidden />
            Votre espace
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{welcome}</p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm shadow-slate-900/[0.04]">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Prochaines étapes
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Votre domaine complétera bientôt ce tableau de bord : acomptes, planning du jour J,
              options du catalogue et échanges avec l&apos;équipe.
            </p>
          </article>
          <article className="rounded-2xl border border-dashed border-border/80 bg-muted/30 p-6">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Besoin d&apos;aide ?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Contactez directement {domain.name} pour toute question sur votre réception.
            </p>
          </article>
        </section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Espace privé propulsé par Venqor · {app.label}
        </p>
      </main>
    </div>
  )
}
