"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CalendarHeart,
  Copy,
  ExternalLink,
  Heart,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"
import { AppDeleteDialog } from "@/components/upstay/app-delete-dialog"
import { WeddingAppFormDialog } from "@/components/upstay/wedding-app-form-dialog"
import { AppStatusSelect } from "@/components/upstay/app-status-select"
import { DashboardSurface } from "@/components/upstay/dashboard-surface"
import { EmptyState } from "@/components/upstay/empty-state"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { countActiveDomainApps, type DomainApp } from "@/lib/domain-apps"
import { useDomainAppsSync } from "@/hooks/use-domain-apps-sync"
import { useDomain } from "@/hooks/use-domain"
import {
  buildWeddingPublicUrl,
  formatCoupleNames,
  formatWeddingDateShort,
} from "@/lib/wedding-apps"
import { toast } from "sonner"

function copyPublicLink(domainSlug: string, appSlug: string) {
  const url = buildWeddingPublicUrl(domainSlug, appSlug)
  void navigator.clipboard.writeText(url)
  toast.success("Lien copié — à envoyer aux mariés.")
}

export function MesAppsManagement() {
  const domain = useDomain()
  const { apps, loading, error } = useDomainAppsSync()
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editing, setEditing] = useState<DomainApp | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DomainApp | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const actives = useMemo(() => countActiveDomainApps(apps), [apps])

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Espaces mariés
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
            Mini-apps par mariage
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Pour chaque couple qui signe chez {domain.name}, créez un espace personnalisé au nom des
            mariés et à la date du mariage. Les mariés y accèdent directement via un lien dédié, sans
            compte Venqor.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2.5">
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-lg border-border/80"
            asChild
          >
            <Link href="/" className="gap-2">
              <ArrowLeft className="size-4" />
              Tableau de bord
            </Link>
          </Button>
          <Button
            size="sm"
            className="h-10 gap-2 rounded-lg px-4 shadow-sm shadow-primary/10"
            onClick={() => {
              setFormMode("create")
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus className="size-4" />
            Créer un espace mariés
          </Button>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-destructive/25 bg-destructive/5 px-5 py-4 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <DashboardSurface className="px-6 py-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Heart className="size-6" aria-hidden />
          </div>
          <div>
            {loading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              <>
                <p className="font-medium text-foreground">
                  {apps.length} espace{apps.length !== 1 ? "s" : ""} mariés
                </p>
                <p className="text-sm text-muted-foreground">{actives} publié(s) pour les couples</p>
              </>
            )}
          </div>
        </div>
      </DashboardSurface>

      {loading ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="rounded-xl border border-border/70 bg-card p-6">
              <Skeleton className="h-28 w-full" />
            </li>
          ))}
        </ul>
      ) : apps.length === 0 ? (
        <DashboardSurface>
          <EmptyState
            icon={CalendarHeart}
            title="Aucun espace mariés pour l'instant"
            description="Dès qu'un couple signe, créez son espace : prénoms, date du mariage, puis partagez le lien personnalisé aux mariés."
          >
            <Button
              className="rounded-lg shadow-sm shadow-primary/10"
              onClick={() => {
                setFormMode("create")
                setEditing(null)
                setFormOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Créer le premier espace
            </Button>
          </EmptyState>
        </DashboardSurface>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {apps.map((app) => {
            const couple = formatCoupleNames(app.partnerOne, app.partnerTwo)
            const publicUrl = buildWeddingPublicUrl(domain.slug, app.slug)
            const isActive = app.status === "Actif"

            return (
              <li key={app.id}>
                <DashboardSurface className="flex h-full flex-col p-6 transition-premium hover:border-border/90">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-semibold tracking-tight text-foreground">{couple}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CalendarHeart className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {formatWeddingDateShort(app.weddingDate)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <AppStatusSelect app={app} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-9 rounded-lg">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setFormMode("edit")
                              setEditing(app)
                              setFormOpen(true)
                            }}
                          >
                            <Pencil className="size-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                              setDeleteTarget(app)
                              setDeleteOpen(true)
                            }}
                          >
                            <Trash2 className="size-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {app.welcomeMessage ? (
                    <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {app.welcomeMessage}
                    </p>
                  ) : null}

                  <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Lien invités
                    </p>
                    <p className="mt-1 break-all font-mono text-xs text-foreground">{publicUrl}</p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1.5 rounded-lg text-xs"
                      onClick={() => copyPublicLink(domain.slug, app.slug)}
                    >
                      <Copy className="size-3.5" />
                      Copier le lien
                    </Button>
                    {isActive ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 gap-1.5 text-xs"
                        asChild
                      >
                        <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                          Ouvrir l&apos;espace
                          <ExternalLink className="size-3" />
                        </a>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Passez en « Actif » pour rendre le lien accessible
                      </span>
                    )}
                  </div>
                </DashboardSurface>
              </li>
            )
          })}
        </ul>
      )}

      <WeddingAppFormDialog
        mode={formMode}
        open={formOpen}
        onOpenChange={setFormOpen}
        app={editing}
      />
      <AppDeleteDialog app={deleteTarget} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  )
}
