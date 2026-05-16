"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { deleteDomainAppAction } from "@/app/actions/domain-apps"
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
import type { DomainApp } from "@/lib/domain-apps"
import { DOMAIN_APPS_CHANGED } from "@/hooks/use-domain-apps-sync"
import { toast } from "sonner"

type AppDeleteDialogProps = {
  app: DomainApp | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppDeleteDialog({ app, open, onOpenChange }: AppDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    if (!app) return
    setDeleting(true)
    try {
      await deleteDomainAppAction(app.id)
      window.dispatchEvent(new Event(DOMAIN_APPS_CHANGED))
      toast.success("Espace mariés supprimé.")
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
          <AlertDialogTitle>Supprimer cet espace mariés ?</AlertDialogTitle>
          <AlertDialogDescription>
            {app ? (
              <>
                L&apos;espace{" "}
                <span className="font-medium text-foreground">{app.label}</span> et son lien
                invités seront définitivement supprimés.
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
            disabled={deleting || !app}
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
