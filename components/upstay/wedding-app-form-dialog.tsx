"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
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
  emptyWeddingAppFormInput,
  recordToWeddingAppFormInput,
  type WeddingAppFormInput,
} from "@/lib/data/domain-apps"
import type { DomainApp } from "@/lib/domain-apps"
import { useDomain } from "@/hooks/use-domain"
import { DOMAIN_APPS_CHANGED } from "@/hooks/use-domain-apps-sync"
import {
  buildWeddingAppLabel,
  buildWeddingAppSlug,
  buildWeddingPublicUrl,
} from "@/lib/wedding-apps"
import { toast } from "sonner"

type WeddingAppFormDialogProps = {
  mode: "create" | "edit"
  open: boolean
  onOpenChange: (open: boolean) => void
  app?: DomainApp | null
}

export function WeddingAppFormDialog({
  mode,
  open,
  onOpenChange,
  app,
}: WeddingAppFormDialogProps) {
  const domain = useDomain()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<WeddingAppFormInput>(emptyWeddingAppFormInput())

  useEffect(() => {
    if (!open) return
    setForm(mode === "edit" && app ? recordToWeddingAppFormInput(app) : emptyWeddingAppFormInput())
  }, [open, mode, app])

  const set =
    <K extends keyof WeddingAppFormInput>(key: K) =>
    (value: WeddingAppFormInput[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
    }

  const preview = useMemo(() => {
    const partnerOne = form.partnerOne.trim()
    const partnerTwo = form.partnerTwo.trim()
    const weddingDate = form.weddingDate.trim()
    if (!partnerOne || !partnerTwo || !weddingDate) return null
    const slug = buildWeddingAppSlug(partnerOne, partnerTwo, weddingDate)
    return {
      label: buildWeddingAppLabel(partnerOne, partnerTwo, weddingDate),
      slug,
      publicUrl: buildWeddingPublicUrl(domain.slug, slug),
    }
  }, [form.partnerOne, form.partnerTwo, form.weddingDate, domain.slug])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.partnerOne.trim() || !form.partnerTwo.trim() || !form.weddingDate.trim()) {
      toast.error("Renseignez les deux prénoms et la date du mariage.")
      return
    }

    setSubmitting(true)
    try {
      const payload: WeddingAppFormInput = {
        ...form,
        partnerOne: form.partnerOne.trim(),
        partnerTwo: form.partnerTwo.trim(),
        weddingDate: form.weddingDate.trim(),
        welcomeMessage: form.welcomeMessage?.trim() || "",
      }

      if (mode === "edit" && app) {
        await updateDomainAppAction(app.id, payload)
        toast.success("Espace mariés mis à jour.")
      } else {
        await createDomainAppAction(payload)
        toast.success("Espace mariés créé — le lien est prêt à être partagé.")
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
      <DialogContent className="max-h-[90vh] gap-2 overflow-y-auto border-border/70 p-6 sm:max-w-lg sm:rounded-2xl sm:p-8">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {mode === "edit" ? "Modifier l'espace mariés" : "Créer un espace mariés"}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            Chaque couple signé reçoit une mini-app personnalisée à son nom et à la date du mariage,
            accessible sans compte Venqor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="partner-one" className="text-muted-foreground">
                Premier marié(e)
              </Label>
              <Input
                id="partner-one"
                value={form.partnerOne}
                onChange={(e) => set("partnerOne")(e.target.value)}
                placeholder="Ex. Marie"
                className="h-11 rounded-lg border-border/80"
                required
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="partner-two" className="text-muted-foreground">
                Second marié(e)
              </Label>
              <Input
                id="partner-two"
                value={form.partnerTwo}
                onChange={(e) => set("partnerTwo")(e.target.value)}
                placeholder="Ex. Pierre"
                className="h-11 rounded-lg border-border/80"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="wedding-date" className="text-muted-foreground">
              Date du mariage
            </Label>
            <Input
              id="wedding-date"
              type="date"
              value={form.weddingDate}
              onChange={(e) => set("weddingDate")(e.target.value)}
              className="h-11 rounded-lg border-border/80"
              required
            />
          </div>

          {preview ? (
            <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                Aperçu
              </p>
              <p className="mt-2 font-medium text-foreground">{preview.label}</p>
              <p className="mt-2 break-all font-mono text-xs text-muted-foreground">
                {preview.publicUrl}
              </p>
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label className="text-muted-foreground">Publication</Label>
            <Select value={form.status} onValueChange={set("status")}>
              <SelectTrigger className="h-11 w-full rounded-lg border-border/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOMAIN_APP_STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "Actif"
                      ? "Actif — lien accessible aux mariés"
                      : s === "Brouillon"
                        ? "Brouillon — lien masqué"
                        : "Suspendu"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="welcome" className="text-muted-foreground">
              Message d&apos;accueil (optionnel)
            </Label>
            <Textarea
              id="welcome"
              value={form.welcomeMessage ?? ""}
              onChange={(e) => set("welcomeMessage")(e.target.value)}
              placeholder="Un mot pour accueillir le couple sur leur espace…"
              rows={4}
              className="resize-none rounded-xl border-border/80"
            />
          </div>

          <DialogFooter className="flex-col-reverse gap-2 border-t border-border/60 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg border-border/80"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="gap-2 rounded-lg shadow-sm shadow-primary/10"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {submitting
                ? "Enregistrement…"
                : mode === "edit"
                  ? "Enregistrer"
                  : "Créer l'espace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
