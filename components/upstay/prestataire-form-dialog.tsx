"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
import {
  createPrestataireAction,
  updatePrestataireAction,
} from "@/app/actions/prestataires"
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
import {
  emptyPrestataireFormInput,
  PRESTATAIRE_CATEGORIES,
  PRESTATAIRE_STATUS_OPTIONS,
  recordToPrestataireFormInput,
  type PrestataireFormInput,
} from "@/lib/data/prestataires"
import type { PrestataireRecord } from "@/lib/prestataires"
import { DOMAIN_PRESTATAIRES_CHANGED } from "@/hooks/use-prestataires-sync"
import { toast } from "sonner"

type PrestataireFormDialogProps = {
  mode: "create" | "edit"
  open: boolean
  onOpenChange: (open: boolean) => void
  prestataire?: PrestataireRecord | null
}

export function PrestataireFormDialog({
  mode,
  open,
  onOpenChange,
  prestataire,
}: PrestataireFormDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<PrestataireFormInput>(emptyPrestataireFormInput())

  useEffect(() => {
    if (!open) return
    setForm(
      mode === "edit" && prestataire
        ? recordToPrestataireFormInput(prestataire)
        : emptyPrestataireFormInput(),
    )
  }, [open, mode, prestataire])

  const set =
    <K extends keyof PrestataireFormInput>(key: K) =>
    (value: PrestataireFormInput[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
    }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("La raison sociale est requise.")
      return
    }

    setSubmitting(true)
    try {
      const payload: PrestataireFormInput = {
        ...form,
        name: form.name.trim(),
        contactName: form.contactName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        lastOrNextMission: form.lastOrNextMission.trim(),
        eventsLinked: Math.max(0, Number(form.eventsLinked) || 0),
      }

      if (mode === "edit" && prestataire) {
        await updatePrestataireAction(prestataire.id, payload)
        toast.success("Prestataire mis à jour.")
      } else {
        await createPrestataireAction(payload)
        toast.success("Prestataire ajouté.")
      }

      window.dispatchEvent(new Event(DOMAIN_PRESTATAIRES_CHANGED))
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Modifier le prestataire" : "Nouveau prestataire"}
          </DialogTitle>
          <DialogDescription>Partenaire référencé pour votre domaine.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="presta-name">Raison sociale</Label>
            <Input
              id="presta-name"
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Catégorie</Label>
              <Select value={form.category} onValueChange={set("category")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESTATAIRE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Statut</Label>
              <Select value={form.status} onValueChange={set("status")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESTATAIRE_STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="presta-contact">Contact</Label>
            <Input
              id="presta-contact"
              value={form.contactName}
              onChange={(e) => set("contactName")(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="presta-email">E-mail</Label>
              <Input
                id="presta-email"
                type="email"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="presta-phone">Téléphone</Label>
              <Input
                id="presta-phone"
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="presta-events">Événements liés</Label>
              <Input
                id="presta-events"
                type="number"
                min={0}
                value={form.eventsLinked}
                onChange={(e) => set("eventsLinked")(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-2 sm:col-span-1">
              <Label htmlFor="presta-mission">Dernière / prochaine mission</Label>
              <Input
                id="presta-mission"
                value={form.lastOrNextMission}
                onChange={(e) => set("lastOrNextMission")(e.target.value)}
                placeholder="Ex. Mariage Dupont — 12 juin"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {submitting ? "Enregistrement…" : mode === "edit" ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
