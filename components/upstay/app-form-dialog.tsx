"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
import { createDomainAppAction, updateDomainAppAction } from "@/app/actions/domain-apps"
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
  DOMAIN_APP_STATUS_OPTIONS,
  emptyAppFormInput,
  recordToAppFormInput,
  type DomainAppFormInput,
} from "@/lib/data/domain-apps"
import type { DomainApp } from "@/lib/domain-apps"
import { buildDomainAppHost } from "@/lib/domain/host"
import { slugifyDomain } from "@/lib/domain/slug"
import { useDomain } from "@/hooks/use-domain"
import { DOMAIN_APPS_CHANGED } from "@/hooks/use-domain-apps-sync"
import { toast } from "sonner"

type AppFormDialogProps = {
  mode: "create" | "edit"
  open: boolean
  onOpenChange: (open: boolean) => void
  app?: DomainApp | null
}

export function AppFormDialog({ mode, open, onOpenChange, app }: AppFormDialogProps) {
  const domain = useDomain()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<DomainAppFormInput>(emptyAppFormInput())

  useEffect(() => {
    if (!open) return
    setForm(mode === "edit" && app ? recordToAppFormInput(app) : emptyAppFormInput())
  }, [open, mode, app])

  const set =
    <K extends keyof DomainAppFormInput>(key: K) =>
    (value: DomainAppFormInput[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
    }

  const slugPreview = slugifyDomain(form.slug || form.label) || "votre-slug"
  const hostPreview = buildDomainAppHost(domain.slug, slugPreview)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.label.trim()) {
      toast.error("Le nom est requis.")
      return
    }

    setSubmitting(true)
    try {
      const payload: DomainAppFormInput = {
        ...form,
        label: form.label.trim(),
        slug: form.slug.trim(),
        description: form.description?.trim() || "",
      }

      if (mode === "edit" && app) {
        await updateDomainAppAction(app.id, payload)
        toast.success("Application mise à jour.")
      } else {
        await createDomainAppAction(payload)
        toast.success("Application créée.")
      }

      window.dispatchEvent(new Event(DOMAIN_APPS_CHANGED))
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Modifier l'application" : "Nouvelle application"}</DialogTitle>
          <DialogDescription>
            Sous-domaine hébergé sur votre espace Venqor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="app-label">Nom</Label>
            <Input
              id="app-label"
              value={form.label}
              onChange={(e) => set("label")(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="app-slug">Sous-domaine</Label>
            <Input
              id="app-slug"
              value={form.slug}
              onChange={(e) => set("slug")(e.target.value)}
              placeholder="Auto depuis le nom si vide"
            />
            <p className="text-xs text-muted-foreground">
              Aperçu : <span className="font-mono text-foreground">https://{hostPreview}</span>
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Statut</Label>
            <Select value={form.status} onValueChange={set("status")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOMAIN_APP_STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="app-desc">Description (optionnel)</Label>
            <Textarea
              id="app-desc"
              value={form.description ?? ""}
              onChange={(e) => set("description")(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {submitting ? "Enregistrement…" : mode === "edit" ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
