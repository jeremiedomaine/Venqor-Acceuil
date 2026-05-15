"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { deletePrestataireAction } from "@/app/actions/prestataires"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { PrestataireRecord } from "@/lib/prestataires"
import { DOMAIN_PRESTATAIRES_CHANGED } from "@/hooks/use-prestataires-sync"
import { toast } from "sonner"

type PrestataireDeleteDialogProps = {
  prestataire: PrestataireRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrestataireDeleteDialog({
  prestataire,
  open,
  onOpenChange,
}: PrestataireDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    if (!prestataire) return
    setDeleting(true)
    try {
      await deletePrestataireAction(prestataire.id)
      window.dispatchEvent(new Event(DOMAIN_PRESTATAIRES_CHANGED))
      toast.success("Prestataire supprimé.")
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Impossible de supprimer.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce prestataire ?</AlertDialogTitle>
          <AlertDialogDescription>
            {prestataire ? (
              <>
                <span className="font-medium text-foreground">{prestataire.name}</span> sera retiré
                de l&apos;annuaire. Action irréversible.
              </>
            ) : (
              "Cette action est irréversible."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => void confirmDelete()}
            disabled={deleting || !prestataire}
            className="gap-2"
          >
            {deleting ? <Loader2 className="size-4 animate-spin" /> : null}
            {deleting ? "Suppression…" : "Supprimer"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
