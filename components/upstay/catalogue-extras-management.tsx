"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, MoreHorizontal, Package, Pencil, Plus, Trash2 } from "lucide-react"
import { updateCatalogueConfigAction, updateCatalogueExtraVisibleAction } from "@/app/actions/catalogue"
import { ExtraDeleteDialog } from "@/components/upstay/extra-delete-dialog"
import { ExtraFormDialog } from "@/components/upstay/extra-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  formatEur,
  priceWithVat,
  type DomainExtra,
  type ExtraCategory,
} from "@/lib/domain-extras"
import { useCatalogueSync, DOMAIN_CATALOGUE_CHANGED } from "@/hooks/use-catalogue-sync"
import { useDomain } from "@/hooks/use-domain"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

function categoryBadgeClass(c: ExtraCategory) {
  const map: Record<ExtraCategory, string> = {
    "Séjour & confort": "border-violet-200 bg-violet-50 text-violet-900",
    Réception: "border-amber-200 bg-amber-50 text-amber-900",
    Animation: "border-sky-200 bg-sky-50 text-sky-900",
    Logistique: "border-slate-200 bg-slate-100 text-slate-800",
  }
  return map[c]
}

export function CatalogueExtrasManagement() {
  const domain = useDomain()
  const { extras, config, setConfig, loading, error } = useCatalogueSync()
  const [savingConfig, setSavingConfig] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editingExtra, setEditingExtra] = useState<DomainExtra | null>(null)
  const [deleteExtra, setDeleteExtra] = useState<DomainExtra | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const visibleCount = useMemo(() => extras.filter((e) => e.visible).length, [extras])

  function openCreate() {
    setFormMode("create")
    setEditingExtra(null)
    setFormOpen(true)
  }

  function openEdit(extra: DomainExtra) {
    setFormMode("edit")
    setEditingExtra(extra)
    setFormOpen(true)
  }

  function openDelete(extra: DomainExtra) {
    setDeleteExtra(extra)
    setDeleteOpen(true)
  }

  async function setVisible(id: string, visible: boolean) {
    setTogglingId(id)
    try {
      await updateCatalogueExtraVisibleAction(id, visible)
      window.dispatchEvent(new Event(DOMAIN_CATALOGUE_CHANGED))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de visibilité.")
    } finally {
      setTogglingId(null)
    }
  }

  async function saveConfig() {
    setSavingConfig(true)
    try {
      const saved = await updateCatalogueConfigAction(config)
      setConfig(saved)
      window.dispatchEvent(new Event(DOMAIN_CATALOGUE_CHANGED))
      toast.success("Configuration enregistrée.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur d'enregistrement.")
    } finally {
      setSavingConfig(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Package className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Catalogue d&apos;extras</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {domain.name} — articles upsell et paramètres d&apos;affichage client.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" size="sm" className="w-fit" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="size-4" />
              Tableau de bord
            </Link>
          </Button>
          <Button size="sm" className="gap-2" onClick={openCreate}>
            <Plus className="size-4" />
            Ajouter un extra
          </Button>
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="rounded-md border border-border bg-card px-4 py-3 text-sm shadow-sm">
        {loading ? (
          <Skeleton className="h-5 w-64" />
        ) : (
          <>
            <span className="text-muted-foreground">{extras.length} extras au catalogue · </span>
            <span className="font-medium text-foreground">{visibleCount}</span>
            <span className="text-muted-foreground"> visibles pour les clients</span>
          </>
        )}
      </div>

      <Tabs defaultValue="catalogue" className="w-full gap-4">
        <TabsList>
          <TabsTrigger value="catalogue">Extras du domaine</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="catalogue" className="rounded-md border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[220px]">Extra</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Prix HT</TableHead>
                <TableHead className="text-right">Prix TTC</TableHead>
                <TableHead className="text-center">TVA</TableHead>
                <TableHead className="text-center">Visible</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : extras.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Aucun extra. Ajoutez votre premier article au catalogue.
                  </TableCell>
                </TableRow>
              ) : (
                extras.map((row) => {
                  const ttc = priceWithVat(row.priceEur, row.vatPercent)
                  return (
                    <TableRow key={row.id}>
                      <TableCell>
                        <p className="font-medium text-foreground">{row.label}</p>
                        <p className="mt-0.5 max-w-md text-xs text-muted-foreground">{row.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("font-normal", categoryBadgeClass(row.category))}>
                          {row.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">{formatEur(row.priceEur)}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatEur(ttc)}
                      </TableCell>
                      <TableCell className="text-center tabular-nums text-muted-foreground">
                        {row.vatPercent} %
                      </TableCell>
                      <TableCell className="text-center">
                        {togglingId === row.id ? (
                          <Loader2 className="mx-auto size-4 animate-spin text-muted-foreground" />
                        ) : (
                          <Switch
                            checked={row.visible}
                            onCheckedChange={(v) => void setVisible(row.id, v)}
                            aria-label={`Afficher ${row.label}`}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(row)}>
                              <Pencil className="size-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => openDelete(row)}
                            >
                              <Trash2 className="size-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <div className="rounded-md border border-border bg-card p-6 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight text-foreground">Affichage catalogue client</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ces options pilotent le parcours upsell proposé aux invités et clients du domaine.
            </p>

            <div className="mt-6 flex items-center justify-between gap-4 rounded-md border border-border px-4 py-3">
              <div>
                <Label htmlFor="ttc-default" className="text-sm font-medium">
                  Afficher les prix TTC par défaut
                </Label>
                <p className="text-xs text-muted-foreground">Sinon les fiches partent sur le prix HT.</p>
              </div>
              <Switch
                id="ttc-default"
                checked={config.showTtcByDefault}
                onCheckedChange={(v) => setConfig((c) => ({ ...c, showTtcByDefault: v }))}
                disabled={loading}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 rounded-md border border-border px-4 py-3">
              <div>
                <Label htmlFor="guest-book" className="text-sm font-medium">
                  Réservation sans compte
                </Label>
                <p className="text-xs text-muted-foreground">Autoriser un parcours invité simplifié.</p>
              </div>
              <Switch
                id="guest-book"
                checked={config.guestBookingAllowed}
                onCheckedChange={(v) => setConfig((c) => ({ ...c, guestBookingAllowed: v }))}
                disabled={loading}
              />
            </div>

            <div className="mt-6 grid gap-2">
              <Label htmlFor="intro">Texte d&apos;introduction (catalogue client)</Label>
              <Textarea
                id="intro"
                rows={4}
                value={config.introClient}
                onChange={(e) => setConfig((c) => ({ ...c, introClient: e.target.value }))}
                disabled={loading}
              />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="lead">Délai minimum avant l&apos;événement (jours)</Label>
                <Input
                  id="lead"
                  type="number"
                  min={0}
                  max={365}
                  value={config.minLeadDays}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, minLeadDays: Math.max(0, Number(e.target.value) || 0) }))
                  }
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fee">Commission plateforme (%)</Label>
                <Input
                  id="fee"
                  type="number"
                  min={0}
                  max={30}
                  step={0.5}
                  value={config.platformFeePercent}
                  onChange={(e) =>
                    setConfig((c) => ({
                      ...c,
                      platformFeePercent: Math.min(30, Math.max(0, Number(e.target.value) || 0)),
                    }))
                  }
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mt-6">
              <Button type="button" onClick={() => void saveConfig()} disabled={savingConfig || loading} className="gap-2">
                {savingConfig ? <Loader2 className="size-4 animate-spin" /> : null}
                {savingConfig ? "Enregistrement…" : "Enregistrer la configuration"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ExtraFormDialog
        mode={formMode}
        open={formOpen}
        onOpenChange={setFormOpen}
        extra={editingExtra}
      />
      <ExtraDeleteDialog extra={deleteExtra} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  )
}
