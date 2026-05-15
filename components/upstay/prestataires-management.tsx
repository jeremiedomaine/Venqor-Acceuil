"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronsUpDown,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"
import { PrestataireDeleteDialog } from "@/components/upstay/prestataire-delete-dialog"
import { PrestataireFormDialog } from "@/components/upstay/prestataire-form-dialog"
import { PrestataireStatusSelect } from "@/components/upstay/prestataire-status-select"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PRESTATAIRE_CATEGORIES } from "@/lib/data/prestataires"
import {
  countPrestatairesActifs,
  type PrestataireCategory,
  type PrestataireRecord,
  type PrestataireStatus,
} from "@/lib/prestataires"
import { usePrestatairesSync } from "@/hooks/use-prestataires-sync"
import { useDomain } from "@/hooks/use-domain"
import { cn } from "@/lib/utils"

type StatusFilter = "all" | PrestataireStatus
type CategoryFilter = "all" | PrestataireCategory

type SortKey = keyof Pick<
  PrestataireRecord,
  "name" | "category" | "contactName" | "email" | "eventsLinked" | "status"
>

function categoryBadgeClass(c: PrestataireCategory) {
  const map: Partial<Record<PrestataireCategory, string>> = {
    Traiteur: "border-orange-200 bg-orange-50 text-orange-900",
    Photographie: "border-violet-200 bg-violet-50 text-violet-900",
    "Musique / DJ": "border-indigo-200 bg-indigo-50 text-indigo-900",
    Fleuriste: "border-pink-200 bg-pink-50 text-pink-900",
    "Location matériel": "border-slate-200 bg-slate-100 text-slate-800",
    Chapiteau: "border-sky-200 bg-sky-50 text-sky-900",
    Sécurité: "border-neutral-300 bg-neutral-100 text-neutral-900",
    Transport: "border-cyan-200 bg-cyan-50 text-cyan-900",
    Coordination: "border-primary/30 bg-primary/10 text-primary",
    Autre: "border-border bg-muted text-muted-foreground",
  }
  return map[c] ?? "border-border bg-muted text-muted-foreground"
}

function SortIndicator({
  active,
  dir,
}: {
  active: boolean
  dir: "asc" | "desc"
}) {
  if (!active) return <ChevronsUpDown className="ml-1 inline size-3.5 opacity-40" aria-hidden />
  return dir === "asc" ? (
    <ArrowUp className="ml-1 inline size-3.5" aria-hidden />
  ) : (
    <ArrowDown className="ml-1 inline size-3.5" aria-hidden />
  )
}

export function PrestatairesManagement() {
  const domain = useDomain()
  const { prestataires, loading, error } = usePrestatairesSync()
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editing, setEditing] = useState<PrestataireRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PrestataireRecord | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = [...prestataires]

    if (statusFilter !== "all") list = list.filter((p) => p.status === statusFilter)
    if (categoryFilter !== "all") list = list.filter((p) => p.category === categoryFilter)
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.contactName.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")),
      )
    }

    const mul = sortDir === "asc" ? 1 : -1
    list.sort((a, b) => {
      let va: string | number = ""
      let vb: string | number = ""
      if (sortKey === "eventsLinked") {
        va = a.eventsLinked
        vb = b.eventsLinked
      } else {
        va = String(a[sortKey]).toLowerCase()
        vb = String(b[sortKey]).toLowerCase()
      }
      if (va < vb) return -1 * mul
      if (va > vb) return 1 * mul
      return 0
    })

    return list
  }, [prestataires, query, statusFilter, categoryFilter, sortKey, sortDir])

  const actifs = useMemo(() => countPrestatairesActifs(prestataires), [prestataires])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir(key === "eventsLinked" ? "desc" : "asc")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Prestataires du domaine</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Annuaire, statuts et suivi des partenaires — {domain.name}.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" size="sm" className="w-fit" asChild>
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
            Ajouter
          </Button>
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-card px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Actifs</p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-12" />
          ) : (
            <p className="text-2xl font-bold tabular-nums text-foreground">{actifs}</p>
          )}
        </div>
        <div className="rounded-md border border-border bg-card px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Référencés</p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-12" />
          ) : (
            <p className="text-2xl font-bold tabular-nums text-foreground">{prestataires.length}</p>
          )}
        </div>
        <div className="rounded-md border border-border bg-card px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Catégories</p>
          <p className="text-2xl font-bold tabular-nums text-foreground">{PRESTATAIRE_CATEGORIES.length}</p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="presta-search">Recherche</Label>
            <Input
              id="presta-search"
              placeholder="Raison sociale, contact, e-mail, téléphone…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Statut</Label>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="Suspendu">Suspendu</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {PRESTATAIRE_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[180px]">
                <button
                  type="button"
                  className="inline-flex items-center font-semibold hover:text-primary"
                  onClick={() => toggleSort("name")}
                >
                  Raison sociale
                  <SortIndicator active={sortKey === "name"} dir={sortDir} />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="inline-flex items-center font-semibold hover:text-primary"
                  onClick={() => toggleSort("category")}
                >
                  Catégorie
                  <SortIndicator active={sortKey === "category"} dir={sortDir} />
                </button>
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead className="whitespace-nowrap">Téléphone</TableHead>
              <TableHead className="text-right">Événements</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Aucun prestataire ne correspond aux critères.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="max-w-[200px] whitespace-normal font-medium text-foreground">
                    {p.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-normal", categoryBadgeClass(p.category))}>
                      {p.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.contactName}</TableCell>
                  <TableCell className="max-w-[180px] truncate text-muted-foreground">{p.email}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{p.phone}</TableCell>
                  <TableCell className="text-right tabular-nums">{p.eventsLinked}</TableCell>
                  <TableCell>
                    <PrestataireStatusSelect prestataire={p} />
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
                        <DropdownMenuItem
                          onClick={() => {
                            setFormMode("edit")
                            setEditing(p)
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
                            setDeleteTarget(p)
                            setDeleteOpen(true)
                          }}
                        >
                          <Trash2 className="size-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {!loading && rows.length > 0 ? (
          <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Dernière / prochaine mission (aperçu)</p>
            <ul className="mt-2 space-y-1">
              {rows.slice(0, 5).map((p) => (
                <li key={`m-${p.id}`}>
                  <span className="text-foreground">{p.name}</span>
                  {" — "}
                  <span>{p.lastOrNextMission || "—"}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-border pt-2">
              {rows.length} ligne{rows.length > 1 ? "s" : ""} affichée{rows.length > 1 ? "s" : ""}.
            </p>
          </div>
        ) : null}
      </div>

      <PrestataireFormDialog
        mode={formMode}
        open={formOpen}
        onOpenChange={setFormOpen}
        prestataire={editing}
      />
      <PrestataireDeleteDialog
        prestataire={deleteTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  )
}
