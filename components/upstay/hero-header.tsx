import { MapPin } from "lucide-react"
import { UserMenu } from "@/components/auth/user-menu"
import { VenqorLogo } from "@/components/venqor-logo"

export function HeroHeader() {
  return (
    <header className="relative h-64 w-full overflow-hidden">
      <img
        src="https://zupimages.net/up/26/17/enyx.jpeg"
        alt="Domaine des lauriers de la Bastide"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/80 via-[#0F172A]/55 to-[#0F172A]/25" />

      <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-8 py-4">
        <div className="rounded-md bg-white/95 px-3 py-2 shadow-sm ring-1 ring-white/30">
          <VenqorLogo size="sm" />
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/80">
            ● En ligne
          </span>
          <UserMenu />
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end px-8 pb-8">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-white">
          Domaine des lauriers de la Bastide
        </h1>
        <div className="mt-2 flex items-center gap-1.5 text-white/80">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="text-sm font-normal">La Jourdane, 81500 Giroussens</span>
        </div>
      </div>
    </header>
  )
}
