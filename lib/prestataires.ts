export type PrestataireCategory =
  | "Traiteur"
  | "Photographie"
  | "Musique / DJ"
  | "Fleuriste"
  | "Location matériel"
  | "Chapiteau"
  | "Sécurité"
  | "Transport"
  | "Coordination"
  | "Autre"

export type PrestataireStatus = "Actif" | "Suspendu" | "En attente"

export type PrestataireRecord = {
  id: string
  /** Raison sociale */
  name: string
  category: PrestataireCategory
  contactName: string
  email: string
  phone: string
  status: PrestataireStatus
  /** Nombre d’événements du domaine où ce prestataire est référencé (démo) */
  eventsLinked: number
  /** Dernière mission ou prochaine (libellé) */
  lastOrNextMission: string
}

/** Prestataires du domaine — données de démo */
export const DOMAIN_PRESTATAIRES: PrestataireRecord[] = [
  {
    id: "p1",
    name: "Saveurs du Sud Traiteur",
    category: "Traiteur",
    contactName: "Julien Caron",
    email: "julien@saveursdusud.fr",
    phone: "05 63 12 34 56",
    status: "Actif",
    eventsLinked: 24,
    lastOrNextMission: "Mariage Inès & Karim — 14 mai 2026",
  },
  {
    id: "p2",
    name: "Studio Lumière Tarn",
    category: "Photographie",
    contactName: "Camille Rey",
    email: "contact@studiolumiere-tarn.fr",
    phone: "06 22 11 09 88",
    status: "Actif",
    eventsLinked: 18,
    lastOrNextMission: "AG Coop Vin — 14 mai 2026",
  },
  {
    id: "p3",
    name: "DJ Mix Occitanie",
    category: "Musique / DJ",
    contactName: "Alexandre Petit",
    email: "booking@djmixoccitanie.fr",
    phone: "06 51 44 77 22",
    status: "Actif",
    eventsLinked: 12,
    lastOrNextMission: "Garden party SCI Lauriers — 28 juin 2026",
  },
  {
    id: "p4",
    name: "Les Jardins Fleuris",
    category: "Fleuriste",
    contactName: "Marine Fabre",
    email: "marine@jardinsfleuris.fr",
    phone: "05 67 89 01 23",
    status: "Actif",
    eventsLinked: 31,
    lastOrNextMission: "Mariage Élodie & Paul — 2 août 2026",
  },
  {
    id: "p5",
    name: "Loc’Réception 81",
    category: "Location matériel",
    contactName: "David Sanchez",
    email: "david@locreception81.fr",
    phone: "05 63 45 67 89",
    status: "Actif",
    eventsLinked: 42,
    lastOrNextMission: "Convention AssurPro — 18 sept. 2026",
  },
  {
    id: "p6",
    name: "Chapiteaux Midi-Pyrénées",
    category: "Chapiteau",
    contactName: "Nicolas Blanc",
    email: "nico@chapiteaux-mp.fr",
    phone: "05 34 22 11 00",
    status: "Actif",
    eventsLinked: 9,
    lastOrNextMission: "Option Garden party — juin 2026",
  },
  {
    id: "p7",
    name: "SecureEvent Pro",
    category: "Sécurité",
    contactName: "Hakim Belaid",
    email: "planning@secureevent.fr",
    phone: "05 61 88 77 66",
    status: "Actif",
    eventsLinked: 15,
    lastOrNextMission: "Séminaire TechCorp — fév. 2026",
  },
  {
    id: "p8",
    name: "Navettes Lauriers",
    category: "Transport",
    contactName: "Patrick Durand",
    email: "contact@navetteslauriers.fr",
    phone: "06 12 34 56 78",
    status: "Actif",
    eventsLinked: 6,
    lastOrNextMission: "Mariage Inès & Karim — 14 mai 2026",
  },
  {
    id: "p9",
    name: "Wedding Planner Tarn",
    category: "Coordination",
    contactName: "Émilie Rousseau",
    email: "emilie@wptarn.fr",
    phone: "06 98 76 54 32",
    status: "Actif",
    eventsLinked: 11,
    lastOrNextMission: "Suivi Mariage Claire & Hugo — 2025",
  },
  {
    id: "p10",
    name: "Son & Lumière Albi",
    category: "Autre",
    contactName: "François Mallet",
    email: "fm@sonlumierealbi.fr",
    phone: "05 63 33 22 11",
    status: "Actif",
    eventsLinked: 8,
    lastOrNextMission: "Soirée privée Leroy — mars 2026",
  },
  {
    id: "p11",
    name: "Buffet des Vignerons",
    category: "Traiteur",
    contactName: "Sandrine Vidal",
    email: "s.vidal@buffetvignerons.fr",
    phone: "05 63 77 66 55",
    status: "Actif",
    eventsLinked: 5,
    lastOrNextMission: "AG Coop Vin — 14 mai 2026",
  },
  {
    id: "p12",
    name: "Instant Photo Box",
    category: "Photographie",
    contactName: "Léo Garnier",
    email: "leo@instantphotobox.fr",
    phone: "06 44 33 22 11",
    status: "Actif",
    eventsLinked: 14,
    lastOrNextMission: "Anniversaire Leroy — mars 2026",
  },
  {
    id: "p13",
    name: "Jazz Live Quartet",
    category: "Musique / DJ",
    contactName: "Marc Antoine",
    email: "marc@jazzlivequartet.fr",
    phone: "06 55 44 33 22",
    status: "Actif",
    eventsLinked: 4,
    lastOrNextMission: "Soirée privée Dupont — déc. 2026",
  },
  {
    id: "p14",
    name: "Artisan Déco Tables",
    category: "Fleuriste",
    contactName: "Isabelle Morel",
    email: "isa@deco-tables.fr",
    phone: "05 63 11 22 33",
    status: "Actif",
    eventsLinked: 19,
    lastOrNextMission: "Mariage Inès & Karim — 14 mai 2026",
  },
  {
    id: "p15",
    name: "Vaisselle & Cie",
    category: "Location matériel",
    contactName: "Thomas Nguyen",
    email: "thomas@vaissellecie.fr",
    phone: "05 34 99 88 77",
    status: "Suspendu",
    eventsLinked: 0,
    lastOrNextMission: "Contrat suspendu — litige en cours",
  },
  {
    id: "p16",
    name: "Feu d’artifice Occitan",
    category: "Autre",
    contactName: "Serge Pélissier",
    email: "serge@feuoccitan.fr",
    phone: "06 77 66 55 44",
    status: "En attente",
    eventsLinked: 0,
    lastOrNextMission: "Attente assurance — dossier incomplet",
  },
  {
    id: "p17",
    name: "Bar à cocktails Le Zinc",
    category: "Traiteur",
    contactName: "Clara Meunier",
    email: "clara@barlezinc.fr",
    phone: "06 11 22 33 44",
    status: "Actif",
    eventsLinked: 7,
    lastOrNextMission: "Garden party — 28 juin 2026",
  },
  {
    id: "p18",
    name: "Vidéaste Histoire d’un Jour",
    category: "Photographie",
    contactName: "Romain Valès",
    email: "romain@histoireunjour.fr",
    phone: "06 33 44 55 66",
    status: "Actif",
    eventsLinked: 10,
    lastOrNextMission: "Mariage Élodie & Paul — août 2026",
  },
  {
    id: "p19",
    name: "Éclairage Scène Pro",
    category: "Autre",
    contactName: "Vincent Lacombe",
    email: "vincent@eclairagescene.fr",
    phone: "05 63 40 40 40",
    status: "Actif",
    eventsLinked: 3,
    lastOrNextMission: "Convention AssurPro — sept. 2026",
  },
  {
    id: "p20",
    name: "Crêpes & Galettes O’Grand Sud",
    category: "Traiteur",
    contactName: "Yannick Floch",
    email: "yannick@ogrand-sud.fr",
    phone: "06 88 99 00 11",
    status: "Actif",
    eventsLinked: 2,
    lastOrNextMission: "Team building TechCorp — fév. 2026",
  },
]

export function countPrestatairesActifs(list: PrestataireRecord[] = DOMAIN_PRESTATAIRES): number {
  return list.filter((p) => p.status === "Actif").length
}
