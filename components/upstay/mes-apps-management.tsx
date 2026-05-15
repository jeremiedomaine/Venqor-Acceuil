"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Plus, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DOMAIN_APPS_SEED,
  loadAllDomainApps,
  persistExtraDomainApp,
  slugifyHostPart,
  type DomainApp,
  type DomainAppStatus,
} from "@/lib/domain-apps"
import { cn } from "@/lib/utils"

function statusBadge(s: DomainAppStatus) {
  if (s === "Actif") return "border-emerald-200 bg-emerald-50 text-emerald-800"
  if (s === "Brouillon") return "border-amber-200 bg-amber-50 text-amber-900"
  return "border-slate-200 bg-muted text-muted-foreground"
}

function formatCreated(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function MesAppsManagement() {
  const [apps, setApps] = useState<DomainApp[]>(() => [...DOMAIN_APPS_SEED])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ label: "", slug: "", description: "" })

  useEffect(() => {
    setApps(loadAllDomainApps())
  }, [])

  const actives = useMemo(() => apps.filter((a) => a.status === "Actif").length, [apps])

  const handleCreate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const label = form.label.trim()
    let slug = slugifyHostPart(form.slug || form.label)
    if (!label || !slug) return

    const existing = loadAllDomainApps()
    if (existing.some((a) => a.slug === slug)) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`
    }

    const host = `${slug}.lauri-bastide.venqor.app`
    const today = new Date().toISOString().slice(0, 10)
    const next: DomainApp = {
      id: `app-${Date.now()}`,
      label,
      slug,
      host,
      status: "Actif",
      createdAt: today,
      description: form.description.trim() || null,
    }

    persistExtraDomainApp(next)
    setApps(loadAllDomainApps())
    setForm({ label: "", slug: "", description: "" })
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Mes applications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sous-domaines et mini-sites créés pour le Domaine des lauriers de la Bastide.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="size-4" />
              Tableau de bord
            </Link>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="size-4" />
                Créer une app
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nouvelle application</DialogTitle>
                <DialogDescription>
                  Définissez un nom et un sous-domaine. L’URL sera générée automatiquement (démo).
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="app-label">Nom de l’application</Label>
                  <Input
                    id="app-label"
                    value={form.label}
                    onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                    placeholder="Ex. Espace traiteurs"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="app-slug">Sous-domaine</Label>
                  <Input
                    id="app-slug"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="Auto depuis le nom si vide"
                  />
                  <p className="text-xs text-muted-foreground">
                    Aperçu :{" "}
                    <span className="font-mono text-foreground">
                      https://
                      {slugifyHostPart(form.slug || form.label) || "votre-slug"}
                      .lauri-bastide.venqor.app
                    </span>
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="app-desc">Description (optionnel)</Label>
                  <Textarea
                    id="app-desc"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="À quoi sert cette app ?"
                    rows={3}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Créer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Smartphone className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{apps.length} application(s)</p>
              <p className="text-xs text-muted-foreground">{actives} active(s)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Sous-domaines du domaine
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {apps.map((app) => (
            <li
              key={app.id}
              className="flex flex-col rounded-md border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{app.label}</p>
                  <p className="mt-1 font-mono text-xs text-primary">{app.host}</p>
                </div>
                <Badge variant="outline" className={cn("shrink-0 font-normal", statusBadge(app.status))}>
                  {app.status}
                </Badge>
              </div>
              {app.description ? (
                <p className="mt-2 text-sm text-muted-foreground">{app.description}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">Créée le {formatCreated(app.createdAt)}</span>
                <Button type="button" variant="ghost" size="sm" className="h-8 gap-1 text-xs" asChild>
                  <a href={`https://${app.host}`} target="_blank" rel="noopener noreferrer">
                    Ouvrir
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
