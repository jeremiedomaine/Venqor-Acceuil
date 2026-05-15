import type { Metadata } from "next"
import { CalendarDays, TrendingUp, Users } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import { VenqorMark } from "@/components/auth/venqor-mark"

export const metadata: Metadata = {
  title: "Connexion – Venqor",
  description: "Connectez-vous à l'espace domaine Venqor.",
}

type PageProps = {
  searchParams: Promise<{ next?: string; error?: string }>
}

const highlights = [
  {
    icon: CalendarDays,
    text: "Événements, clients et registre unifiés",
  },
  {
    icon: TrendingUp,
    text: "Upsells et catalogue sous contrôle",
  },
  {
    icon: Users,
    text: "Prestataires et apps du domaine",
  },
]

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams
  const nextPath = params.next?.startsWith("/") ? params.next : "/"
  const callbackError = params.error === "auth_callback"

  return (
    <div className="relative min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Panneau brand */}
        <div className="relative hidden overflow-hidden bg-[#0F172A] lg:flex lg:flex-col lg:justify-between">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(79,70,229,0.45),transparent),radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(99,102,241,0.25),transparent)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-24 top-1/3 size-72 rounded-full bg-indigo-500/20 blur-3xl"
            aria-hidden
          />

          <div className="relative z-10 p-10 xl:p-14">
            <VenqorMark />
          </div>

          <div className="relative z-10 px-10 pb-14 xl:px-14 xl:pb-16">
            <h1 className="max-w-md text-balance text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
              Pilotez votre domaine,{" "}
              <span className="text-indigo-300">événement après événement.</span>
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              Le tableau de bord Venqor centralise réservations, extras et partenaires
              pour les lieux d&apos;exception.
            </p>

            <ul className="mt-10 space-y-4">
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/15">
                    <Icon className="size-4 text-indigo-200" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative z-10 border-t border-white/10 px-10 py-5 text-xs text-white/40 xl:px-14">
            © {new Date().getFullYear()} Venqor — Accès sécurisé opérateurs
          </p>
        </div>

        {/* Formulaire */}
        <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-10">
          <LoginForm nextPath={nextPath} callbackError={callbackError} />
        </div>
      </div>
    </div>
  )
}
