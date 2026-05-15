"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { deleteDomainEventAction } from "@/app/actions/events"
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
import type { DomainEventRecord } from "@/lib/domain-events"
import { DOMAIN_EVENTS_CHANGED } from "@/hooks/use-domain-events-sync"
import { toast } from "sonner"

type EventDeleteDialogProps = {
  event: DomainEventRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

export function EventDeleteDialog({
  event,
  open,
  onOpenChange,
  onDeleted,
}: EventDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    if (!event) return
    setDeleting(true)
    try {
      await deleteDomainEventAction(event.id)
      window.dispatchEvent(new Event(DOMAIN_EVENTS_CHANGED))
      toast.success("Événement supprimé.")
      onOpenChange(false)
      onDeleted?.()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de supprimer l'événement.",
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border/70 sm:rounded-2xl">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-lg font-semibold tracking-tight">
            Supprimer cet événement ?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed">
            {event ? (
              <>
                <span className="font-medium text-foreground">{event.title}</span> sera
                définitivement retiré du registre et du tableau de bord. Cette action est
                irréversible.
              </>
            ) : (
              "Cette action est irréversible."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-3">
          <AlertDialogCancel
            disabled={deleting}
            className="rounded-lg border-border/80 transition-premium"
          >
            Annuler
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => void confirmDelete()}
            disabled={deleting || !event}
            className="gap-2 rounded-lg transition-premium"
          >
            {deleting ? <Loader2 className="size-4 animate-spin" /> : null}
            {deleting ? "Suppression…" : "Supprimer"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
