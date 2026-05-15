"use client"

import { MapPin } from "lucide-react"
import { UserMenu } from "@/components/auth/user-menu"
import { VenqorLogo } from "@/components/venqor-logo"
import { useDomain } from "@/hooks/use-domain"

const FALLBACK_COVER = "https://zupimages.net/up/26/17/enyx.jpeg"

export function HeroHeader() {
  const domain = useDomain()
  const cover = domain.coverImageUrl || FALLBACK_COVER

  return (
    <header className="relative h-[17rem] w-full overflow-hidden sm:h-[19rem]">
      <img
        src={cover}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/50 to-slate-800/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />

      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
        <div className="rounded-xl border border-white/20 bg-white/92 px-3.5 py-2.5 shadow-sm shadow-slate-900/10 backdrop-blur-sm transition-premium">
          <VenqorLogo size="sm" />
        </div>
        <div className="relative z-20 flex items-center gap-3">
          <span className="rounded-full border border-emerald-200/60 bg-emerald-50/95 px-3.5 py-1.5 text-xs font-medium text-emerald-900 shadow-sm shadow-emerald-900/5">
            <span className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald-500" aria-hidden />
            En ligne
          </span>
          <UserMenu />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end px-5 pb-9 sm:px-8 sm:pb-10">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/70">
          Votre domaine
        </p>
        <h1 className="mt-2 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {domain.name}
        </h1>
        {domain.address ? (
          <div className="mt-3 flex max-w-xl items-start gap-2 text-white/85">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 opacity-90" aria-hidden />
            <span className="text-sm font-normal leading-relaxed">{domain.address}</span>
          </div>
        ) : null}
      </div>
    </header>
  )
}
