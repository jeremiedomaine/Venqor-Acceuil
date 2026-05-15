export type DomainAppStatus = "Actif" | "Brouillon" | "Suspendu"

export type DomainApp = {
  id: string
  /** Nom affiché dans le back-office */
  label: string
  /** Partie hôte du sous-domaine (sans protocole), ex. upsells */
  slug: string
  /** URL complète affichée */
  host: string
  status: DomainAppStatus
  /** ISO yyyy-mm-dd */
  createdAt: string
  description: string | null
}

/** Données de démo pour le script de seed (`npm run db:seed`) */
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

export function countActiveDomainApps(apps: DomainApp[] = []): number {
  return apps.filter((a) => a.status === "Actif").length
}
