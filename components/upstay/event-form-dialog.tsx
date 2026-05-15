"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
import {
  createDomainEventAction,
  updateDomainEventAction,
} from "@/app/actions/events"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  emptyEventFormInput,
  recordToFormInput,
  type EventFormInput,
} from "@/lib/data/events"
import {
  BOOKING_STATUS_OPTIONS,
  DOMAIN_EVENT_TYPE_OPTIONS,
  type DomainEventRecord,
} from "@/lib/domain-events"
import { DOMAIN_EVENTS_CHANGED } from "@/hooks/use-domain-events-sync"
import { toast } from "sonner"

type EventFormDialogProps = {
  mode: "create" | "edit"
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: DomainEventRecord | null
  onSuccess?: () => void
}

export function EventFormDialog({
  mode,
  open,
  onOpenChange,
  event,
  onSuccess,
}: EventFormDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<EventFormInput>(emptyEventFormInput())

  useEffect(() => {
    if (!open) return
    if (mode === "edit" && event) {
      setForm(recordToFormInput(event))
    } else {
      setForm(emptyEventFormInput())
    }
  }, [open, mode, event])

  const set =
    <K extends keyof EventFormInput>(key: K) =>
    (value: EventFormInput[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
    }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const title = form.title.trim()
    const dateStart = form.dateStart.trim()
    const guests = Number(form.guests)

    if (!title || !dateStart || !guests || guests < 1) {
      toast.error("Renseignez le titre, la date et le nombre d'invités.")
      return
    }

    setSubmitting(true)
    try {
      const payload: EventFormInput = {
        ...form,
        title,
        dateStart,
        dateEnd: form.dateEnd?.trim() || dateStart,
        guests,
        clientOrOrg: form.clientOrOrg.trim(),
      }

      if (mode === "edit" && event) {
        await updateDomainEventAction(event.id, payload)
        toast.success("Événement mis à jour.")
      } else {
        await createDomainEventAction(payload)
        toast.success("Événement créé.")
      }

      window.dispatchEvent(new Event(DOMAIN_EVENTS_CHANGED))
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Une erreur est survenue.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-2 overflow-y-auto border-border/70 bg-card p-6 shadow-sm shadow-slate-900/8 sm:max-w-[28rem] sm:rounded-2xl sm:p-8">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
            {mode === "edit" ? "Modifier l'événement" : "Nouvel événement"}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {mode === "edit"
              ? "Les modifications sont enregistrées immédiatement sur le registre et le tableau de bord."
              : "L'événement apparaîtra sur le tableau de bord et dans le registre."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="ev-form-title" className="text-muted-foreground">Nom de l&apos;événement</Label>
            <Input
              className="h-11 rounded-lg border-border/80 transition-premium"
              id="ev-form-title"
              value={form.title}
              onChange={(e) => set("title")(e.target.value)}
              placeholder="Ex. Mariage de Claire & Hugo"
              required
              autoFocus
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Type</Label>
              <Select value={form.eventType} onValueChange={set("eventType")}>
                <SelectTrigger className="h-11 w-full rounded-lg border-border/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOMAIN_EVENT_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Statut réservation</Label>
              <Select
                value={form.bookingStatus}
                onValueChange={(v) => set("bookingStatus")(v as EventFormInput["bookingStatus"])}
              >
                <SelectTrigger className="h-11 w-full rounded-lg border-border/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOOKING_STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="ev-form-start" className="text-muted-foreground">
                Date de début
              </Label>
              <Input
                className="h-11 rounded-lg border-border/80"
                id="ev-form-start"
                type="date"
                value={form.dateStart}
                onChange={(e) => set("dateStart")(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ev-form-end" className="text-muted-foreground">
                Date de fin
              </Label>
              <Input
                className="h-11 rounded-lg border-border/80"
                id="ev-form-end"
                type="date"
                value={form.dateEnd}
                onChange={(e) => set("dateEnd")(e.target.value)}
                min={form.dateStart || undefined}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="ev-form-client" className="text-muted-foreground">
                Client / organisation
              </Label>
              <Input
                className="h-11 rounded-lg border-border/80"
                id="ev-form-client"
                value={form.clientOrOrg}
                onChange={(e) => set("clientOrOrg")(e.target.value)}
                placeholder="Famille Martin, Société X…"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ev-form-guests" className="text-muted-foreground">
                Nombre d&apos;invités
              </Label>
              <Input
                className="h-11 rounded-lg border-border/80 tabular-nums"
                id="ev-form-guests"
                type="number"
                min={1}
                value={form.guests || ""}
                onChange={(e) => set("guests")(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ev-form-notes" className="text-muted-foreground">
              Notes internes
            </Label>
            <Textarea
              className="resize-none rounded-xl border-border/80 transition-premium"
              id="ev-form-notes"
              value={form.notes ?? ""}
              onChange={(e) => set("notes")(e.target.value)}
              placeholder="Allergies, contraintes horaires, contact sur place…"
              rows={3}
            />
          </div>

          <DialogFooter className="flex-col-reverse gap-2 border-t border-border/60 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg border-border/80 transition-premium"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="gap-2 rounded-lg shadow-sm shadow-primary/10 transition-premium"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {submitting
                ? "Enregistrement…"
                : mode === "edit"
                  ? "Enregistrer"
                  : "Créer l'événement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
