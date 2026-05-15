export type DomainAppStatus = "Actif" | "Brouillon" | "Suspendu"

export type DomainApp = {
  id: string
  /** Nom affiché dans le back-office */
  label: string
  /** Partie hôte du sous-domaine (sans protocole), ex. upsells */
  slug: string
  /** URL complète affichée (démo) */
  host: string
  status: DomainAppStatus
  /** ISO yyyy-mm-dd */
  createdAt: string
  description: string | null
}

/** Applications / sous-domaines créés pour le domaine (démo) */
export const DOMAIN_APPS_SEED: DomainApp[] = [
  {
    id: "app-1",
    label: "Espace réservations B2B",
    slug: "reservations",
    host: "reservations.lauri-bastide.venqor.app",
    status: "Actif",
    createdAt: "2025-01-12",
    description: "Portail partenaires et demandes de devis.",
  },
  {
    id: "app-2",
    label: "Boutique upsells séjour",
    slug: "extras",
    host: "extras.lauri-bastide.venqor.app",
    status: "Actif",
    createdAt: "2025-03-02",
    description: "Chapiteaux, borne selfie, options pour les clients.",
  },
  {
    id: "app-3",
    label: "Calendrier public événements",
    slug: "agenda",
    host: "agenda.lauri-bastide.venqor.app",
    status: "Actif",
    createdAt: "2025-06-18",
    description: "Vue simplifiée des dates déjà optionnées.",
  },
]

export function countActiveDomainApps(apps: DomainApp[] = DOMAIN_APPS_SEED): number {
  return apps.filter((a) => a.status === "Actif").length
}

export function slugifyHostPart(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
}

const STORAGE_KEY = "venqor-domain-apps-extras"

export function loadExtraDomainApps(): DomainApp[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DomainApp[]) : []
  } catch {
    return []
  }
}

export function loadAllDomainApps(): DomainApp[] {
  return [...loadExtraDomainApps(), ...DOMAIN_APPS_SEED]
}

export function persistExtraDomainApp(app: DomainApp): void {
  if (typeof window === "undefined") return
  try {
    const next = [app, ...loadExtraDomainApps().filter((a) => a.id !== app.id)]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event("venqor-apps-changed"))
  } catch {
    /* ignore */
  }
}
