import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { WeddingPortalView } from "@/components/wedding-portal/wedding-portal-view"
import { getPublicWeddingPortal } from "@/lib/data/wedding-portal"
import { formatCoupleNames } from "@/lib/wedding-apps"

type PageProps = {
  params: Promise<{ domainSlug: string; appSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domainSlug, appSlug } = await params
  const portal = await getPublicWeddingPortal(domainSlug, appSlug)

  if (!portal) {
    return { title: "Espace introuvable" }
  }

  const couple = formatCoupleNames(portal.app.partnerOne, portal.app.partnerTwo)

  return {
    title: `${couple} — ${portal.domain.name}`,
    description: `Espace mariés pour ${couple} chez ${portal.domain.name}.`,
  }
}

export default async function WeddingPortalPage({ params }: PageProps) {
  const { domainSlug, appSlug } = await params
  const portal = await getPublicWeddingPortal(domainSlug, appSlug)

  if (!portal) {
    notFound()
  }

  return <WeddingPortalView portal={portal} />
}
