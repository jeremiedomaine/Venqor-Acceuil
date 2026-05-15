export type MessagingClient = {
  id: string
  name: string
  company: string | null
  email: string
  lastMessage: string
  /** Libellé relatif type « Il y a 2 h » */
  lastAtLabel: string
  unread: number
}

/** Clients avec fil de discussion (démo) */
export const MESSAGING_CLIENTS: MessagingClient[] = [
  {
    id: "c1",
    name: "Inès Benali",
    company: null,
    email: "ines.b@email.fr",
    lastMessage: "Parfait pour la salle des fêtes le samedi.",
    lastAtLabel: "Il y a 12 min",
    unread: 2,
  },
  {
    id: "c2",
    name: "Thomas Martin",
    company: "Famille Martin",
    email: "t.martin@email.fr",
    lastMessage: "Merci pour le devis chapiteau.",
    lastAtLabel: "Il y a 1 h",
    unread: 0,
  },
  {
    id: "c3",
    name: "Sophie Leroy",
    company: null,
    email: "s.leroy@email.fr",
    lastMessage: "Pouvez-vous confirmer le menu végétarien ?",
    lastAtLabel: "Il y a 2 h",
    unread: 1,
  },
  {
    id: "c4",
    name: "L'Oréal France",
    company: "Events corporate",
    email: "events@loreal.fr",
    lastMessage: "Planning envoyé en PJ.",
    lastAtLabel: "Hier",
    unread: 0,
  },
  {
    id: "c5",
    name: "Élodie Marchand",
    company: null,
    email: "elodie.m@email.fr",
    lastMessage: "On arrive vers 14 h le jour J.",
    lastAtLabel: "Hier",
    unread: 0,
  },
  {
    id: "c6",
    name: "Coopérative Vin du Tarn",
    company: "AG",
    email: "contact@coopvin.fr",
    lastMessage: "Besoin de 10 places parking sup.",
    lastAtLabel: "Il y a 2 j",
    unread: 1,
  },
  {
    id: "c7",
    name: "SCI Les Lauriers",
    company: null,
    email: "gestion@sci-lauriers.fr",
    lastMessage: "Option chapiteau toujours valable ?",
    lastAtLabel: "Il y a 3 j",
    unread: 1,
  },
  {
    id: "c8",
    name: "AssurPro Méditerranée",
    company: "Convention",
    email: "logistique@assurpro.fr",
    lastMessage: "Bonjour, merci pour votre retour.",
    lastAtLabel: "Il y a 5 j",
    unread: 0,
  },
  {
    id: "c9",
    name: "Marc Dubois",
    company: null,
    email: "marc.d@email.fr",
    lastMessage: "Soirée annulée finalement.",
    lastAtLabel: "Il y a 1 sem.",
    unread: 0,
  },
  {
    id: "c10",
    name: "Famille Dupont",
    company: null,
    email: "dupont.famille@email.fr",
    lastMessage: "Réveillon : horaires de fin ?",
    lastAtLabel: "Il y a 2 sem.",
    unread: 0,
  },
]

export function totalUnreadMessages(clients: MessagingClient[] = MESSAGING_CLIENTS): number {
  return clients.reduce((n, c) => n + c.unread, 0)
}
