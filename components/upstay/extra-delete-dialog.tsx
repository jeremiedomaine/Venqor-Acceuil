"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { deleteCatalogueExtraAction } from "@/app/actions/catalogue"
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
import type { DomainExtra } from "@/lib/domain-extras"
import { DOMAIN_CATALOGUE_CHANGED } from "@/hooks/use-catalogue-sync"
import { toast } from "sonner"

type ExtraDeleteDialogProps = {
  extra: DomainExtra | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExtraDeleteDialog({ extra, open, onOpenChange }: ExtraDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    if (!extra) return
    setDeleting(true)
    try {
      await deleteCatalogueExtraAction(extra.id)
      window.dispatchEvent(new Event(DOMAIN_CATALOGUE_CHANGED))
      toast.success("Extra supprimé.")
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
          <AlertDialogTitle>Supprimer cet extra ?</AlertDialogTitle>
          <AlertDialogDescription>
            {extra ? (
              <>
                <span className="font-medium text-foreground">{extra.label}</span> sera retiré du
                catalogue. Action irréversible.
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
            disabled={deleting || !extra}
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
