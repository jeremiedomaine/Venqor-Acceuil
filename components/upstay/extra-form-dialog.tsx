"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
import {
  createCatalogueExtraAction,
  updateCatalogueExtraAction,
} from "@/app/actions/catalogue"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  emptyExtraFormInput,
  recordToExtraFormInput,
  type ExtraFormInput,
} from "@/lib/data/catalogue"
import { EXTRA_CATEGORIES, type DomainExtra } from "@/lib/domain-extras"
import { DOMAIN_CATALOGUE_CHANGED } from "@/hooks/use-catalogue-sync"
import { toast } from "sonner"

type ExtraFormDialogProps = {
  mode: "create" | "edit"
  open: boolean
  onOpenChange: (open: boolean) => void
  extra?: DomainExtra | null
}

export function ExtraFormDialog({
  mode,
  open,
  onOpenChange,
  extra,
}: ExtraFormDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<ExtraFormInput>(emptyExtraFormInput())

  useEffect(() => {
    if (!open) return
    setForm(mode === "edit" && extra ? recordToExtraFormInput(extra) : emptyExtraFormInput())
  }, [open, mode, extra])

  const set =
    <K extends keyof ExtraFormInput>(key: K) =>
    (value: ExtraFormInput[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
    }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.label.trim()) {
      toast.error("Le libellé est requis.")
      return
    }

    setSubmitting(true)
    try {
      const payload: ExtraFormInput = {
        ...form,
        label: form.label.trim(),
        description: form.description.trim(),
        priceEur: Number(form.priceEur) || 0,
        vatPercent: Number(form.vatPercent) || 0,
      }

      if (mode === "edit" && extra) {
        await updateCatalogueExtraAction(extra.id, payload)
        toast.success("Extra mis à jour.")
      } else {
        await createCatalogueExtraAction(payload)
        toast.success("Extra ajouté au catalogue.")
      }

      window.dispatchEvent(new Event(DOMAIN_CATALOGUE_CHANGED))
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
          <DialogTitle>{mode === "edit" ? "Modifier l'extra" : "Nouvel extra"}</DialogTitle>
          <DialogDescription>
            Article du catalogue upsell visible par vos clients.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="extra-label">Libellé</Label>
            <Input
              id="extra-label"
              value={form.label}
              onChange={(e) => set("label")(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="extra-desc">Description</Label>
            <Textarea
              id="extra-desc"
              value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              rows={3}
              className="resize-none"
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
                  {EXTRA_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="extra-vat">TVA (%)</Label>
              <Input
                id="extra-vat"
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={form.vatPercent}
                onChange={(e) => set("vatPercent")(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="extra-price">Prix HT (€)</Label>
              <Input
                id="extra-price"
                type="number"
                min={0}
                step={1}
                value={form.priceEur || ""}
                onChange={(e) => set("priceEur")(Number(e.target.value))}
              />
            </div>
            <div className="flex items-end gap-3 rounded-md border border-border px-3 py-2">
              <Switch
                id="extra-visible"
                checked={form.visible}
                onCheckedChange={set("visible")}
              />
              <Label htmlFor="extra-visible" className="text-sm">
                Visible clients
              </Label>
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
