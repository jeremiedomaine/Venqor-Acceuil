export type DomainAppStatus = "Actif" | "Brouillon" | "Suspendu"

/** Mini-app mariage rattachée au domaine — espace invités pour un couple */
export type DomainApp = {
  id: string
  /** Titre généré (ex. Mariage de Marie & Pierre — 14 juin 2026) */
  label: string
  slug: string
  host: string
  status: DomainAppStatus
  createdAt: string
  partnerOne: string
  partnerTwo: string
  /** ISO yyyy-mm-dd */
  weddingDate: string
  welcomeMessage: string | null
  description: string | null
}

/** Exemples démo Lauriers — espaces mariés */
export const DOMAIN_APPS_SEED: Omit<DomainApp, "id">[] = [
  {
    label: "Mariage de Claire & Hugo — 12 septembre 2025",
    slug: "claire-et-hugo-12-septembre-2025",
    host: "claire-et-hugo-12-septembre-2025.lauri-bastide.venqor.app",
    status: "Actif",
    createdAt: "2025-06-01",
    partnerOne: "Claire",
    partnerTwo: "Hugo",
    weddingDate: "2025-09-12",
    welcomeMessage:
      "Bienvenue dans votre espace dédié. Retrouvez ici les informations pratiques pour votre mariage aux Lauriers.",
    description: null,
  },
  {
    label: "Mariage de Thomas & Léa — 14 mai 2025",
    slug: "thomas-et-lea-14-mai-2025",
    host: "thomas-et-lea-14-mai-2025.lauri-bastide.venqor.app",
    status: "Actif",
    createdAt: "2025-01-12",
    partnerOne: "Thomas",
    partnerTwo: "Léa",
    weddingDate: "2025-05-14",
    welcomeMessage: "Votre journée approche — tout est réuni ici pour préparer sereinement votre réception.",
    description: null,
  },
  {
    label: "Mariage de Sophie & Marc — 22 juin 2026",
    slug: "sophie-et-marc-22-juin-2026",
    host: "sophie-et-marc-22-juin-2026.lauri-bastide.venqor.app",
    status: "Brouillon",
    createdAt: "2025-03-02",
    partnerOne: "Sophie",
    partnerTwo: "Marc",
    weddingDate: "2026-06-22",
    welcomeMessage: null,
    description: null,
  },
]

export function countActiveDomainApps(apps: DomainApp[] = []): number {
  return apps.filter((a) => a.status === "Actif").length
}
