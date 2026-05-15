export type ExtraCategory = "Séjour & confort" | "Réception" | "Animation" | "Logistique"

export type DomainExtra = {
  id: string
  label: string
  description: string
  /** Prix en euros (HT affiché catalogue — démo) */
  priceEur: number
  category: ExtraCategory
  /** Affiché aux clients sur les parcours upsell */
  visible: boolean
  /** TVA % appliquée à la ligne (démo) */
  vatPercent: number
}

export const DOMAIN_EXTRAS_SEED: DomainExtra[] = [
  {
    id: "x1",
    label: "Borne à selfies",
    description: "Pack 4 h, tirages illimités, fond personnalisable.",
    priceEur: 350,
    category: "Animation",
    visible: true,
    vatPercent: 20,
  },
  {
    id: "x2",
    label: "Chapiteau Garden Party",
    description: "Structure 15×25 m, solains, éclairage base.",
    priceEur: 600,
    category: "Réception",
    visible: true,
    vatPercent: 20,
  },
  {
    id: "x3",
    label: "Location mobilier & vaisselle",
    description: "Assiettes premium, verrerie, tables 180 cm.",
    priceEur: 290,
    category: "Réception",
    visible: true,
    vatPercent: 20,
  },
  {
    id: "x4",
    label: "Brunch lendemain de mariage",
    description: "Buffet froid / chaud pour 80 pers. min.",
    priceEur: 42,
    category: "Séjour & confort",
    visible: true,
    vatPercent: 10,
  },
  {
    id: "x5",
    label: "Navette aéroport / gare",
    description: "Aller simple ou journée, 8 places max.",
    priceEur: 120,
    category: "Logistique",
    visible: true,
    vatPercent: 10,
  },
  {
    id: "x6",
    label: "DJ set soirée (+ sono)",
    description: "5 h de prestation, playlist partagée en amont.",
    priceEur: 890,
    category: "Animation",
    visible: true,
    vatPercent: 20,
  },
  {
    id: "x7",
    label: "Suite nuptiale premium",
    description: "Nuitée + petit-déjeuner room service.",
    priceEur: 220,
    category: "Séjour & confort",
    visible: false,
    vatPercent: 10,
  },
  {
    id: "x8",
    label: "Feu d’artifice 5 min",
    description: "Sur devis mairie — prestataire agréé.",
    priceEur: 1800,
    category: "Animation",
    visible: false,
    vatPercent: 20,
  },
]

export type CatalogueConfig = {
  /** Afficher les prix TTC par défaut */
  showTtcByDefault: boolean
  /** Texte d’intro affiché en tête du catalogue client */
  introClient: string
  /** Délai minimum (jours) avant l’événement pour réserver un extra */
  minLeadDays: number
  /** Autoriser la réservation sans compte client */
  guestBookingAllowed: boolean
  /** Commission plateforme % (démo) */
  platformFeePercent: number
}

export const DEFAULT_CATALOGUE_CONFIG: CatalogueConfig = {
  showTtcByDefault: true,
  introClient:
    "Composez votre séjour : nos extras sont proposés à titre indicatif et confirmés selon disponibilité.",
  minLeadDays: 7,
  guestBookingAllowed: true,
  platformFeePercent: 8,
}

export function formatEur(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function priceWithVat(ht: number, vatPercent: number) {
  return ht * (1 + vatPercent / 100)
}
