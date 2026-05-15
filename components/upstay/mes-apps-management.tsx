"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Plus,
  Smartphone,
  Trash2,
} from "lucide-react"
import { AppDeleteDialog } from "@/components/upstay/app-delete-dialog"
import { AppFormDialog } from "@/components/upstay/app-form-dialog"
import { AppStatusSelect } from "@/components/upstay/app-status-select"
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

function formatCreated(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Mes applications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sous-domaines et mini-sites créés pour {domain.name}.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="size-4" />
              Tableau de bord
            </Link>
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => {
              setFormMode("create")
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus className="size-4" />
            Créer une app
          </Button>
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="rounded-md border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Smartphone className="size-5" />
            </div>
            <div>
              {loading ? (
                <Skeleton className="h-5 w-32" />
              ) : (
                <>
                  <p className="text-sm font-medium text-foreground">{apps.length} application(s)</p>
                  <p className="text-xs text-muted-foreground">{actives} active(s)</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Sous-domaines du domaine
        </h2>
        {loading ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="rounded-md border border-border bg-card p-4">
                <Skeleton className="h-24 w-full" />
              </li>
            ))}
          </ul>
        ) : apps.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            Aucune application. Créez votre premier sous-domaine.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {apps.map((app) => (
              <li
                key={app.id}
                className="flex flex-col rounded-md border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{app.label}</p>
                    <p className="mt-1 font-mono text-xs text-primary">{app.host}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <AppStatusSelect app={app} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
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
                {app.description ? (
                  <p className="mt-2 text-sm text-muted-foreground">{app.description}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">
                    Créée le {formatCreated(app.createdAt)}
                  </span>
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
        )}
      </div>

      <AppFormDialog mode={formMode} open={formOpen} onOpenChange={setFormOpen} app={editing} />
      <AppDeleteDialog app={deleteTarget} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  )
}
