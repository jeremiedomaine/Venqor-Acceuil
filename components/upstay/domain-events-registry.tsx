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
import { EventDeleteDialog } from "@/components/upstay/event-delete-dialog"
import { EventFormDialog } from "@/components/upstay/event-form-dialog"
import { EventStatusSelect } from "@/components/upstay/event-status-select"
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
import {
  formatPeriod,
  getEventTemporal,
  typeLabel,
  type DomainEventRecord,
  type DomainEventTemporal,
  type DomainEventType,
} from "@/lib/domain-events"
import { useDomainEventsSync } from "@/hooks/use-domain-events-sync"
import { useDomain } from "@/hooks/use-domain"
import { cn } from "@/lib/utils"

type TemporalFilter = "all" | DomainEventTemporal
type TypeFilter = "all" | DomainEventType
type SortKey = keyof Pick<
  DomainEventRecord,
  "title" | "type" | "dateStart" | "guestCount" | "bookingStatus" | "clientOrOrg"
>

function typeBadgeClass(t: DomainEventType) {
  if (t === "Mariage") return "border-rose-200 bg-rose-50 text-rose-700"
  if (t === "Seminaire") return "border-sky-200 bg-sky-50 text-sky-800"
  return "border-violet-200 bg-violet-50 text-violet-800"
}

function temporalLabel(temp: DomainEventTemporal) {
  if (temp === "past") return "Passé"
  if (temp === "upcoming") return "À venir"
  return "En cours"
}

function temporalBadgeClass(temp: DomainEventTemporal) {
  if (temp === "past") return "border-slate-200 bg-slate-100 text-slate-700"
  if (temp === "upcoming") return "border-primary/30 bg-primary/10 text-primary"
  return "border-emerald-200 bg-emerald-50 text-emerald-800"
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

function RegistrySkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="ml-auto h-4 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-7 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function DomainEventsRegistry() {
  const domain = useDomain()
  const { events: allEvents, loading, error } = useDomainEventsSync()
  const [query, setQuery] = useState("")
  const [temporal, setTemporal] = useState<TemporalFilter>("all")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [sortKey, setSortKey] = useState<SortKey>("dateStart")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const [createOpen, setCreateOpen] = useState(false)
  const [editEvent, setEditEvent] = useState<DomainEventRecord | null>(null)
  const [deleteEvent, setDeleteEvent] = useState<DomainEventRecord | null>(null)

  const stats = useMemo(() => {
    const now = new Date()
    let upcoming = 0
    let ongoing = 0
    for (const e of allEvents) {
      const t = getEventTemporal(e, now)
      if (t === "upcoming") upcoming++
      if (t === "ongoing") ongoing++
    }
    return { total: allEvents.length, upcoming, ongoing }
  }, [allEvents])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = allEvents.map((r) => ({
      ...r,
      temporal: getEventTemporal(r),
    }))

    if (temporal !== "all") {
      list = list.filter((r) => r.temporal === temporal)
    }
    if (typeFilter !== "all") {
      list = list.filter((r) => r.type === typeFilter)
    }
    if (q) {
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.clientOrOrg.toLowerCase().includes(q) ||
          (r.notes?.toLowerCase().includes(q) ?? false),
      )
    }

    const mul = sortDir === "asc" ? 1 : -1
    list = [...list].sort((a, b) => {
      let va: string | number = ""
      let vb: string | number = ""
      switch (sortKey) {
        case "guestCount":
          va = a.guestCount
          vb = b.guestCount
          break
        case "dateStart":
          va = a.dateStart
          vb = b.dateStart
          break
        default:
          va = a[sortKey].toString().toLowerCase()
          vb = b[sortKey].toString().toLowerCase()
      }
      if (va < vb) return -1 * mul
      if (va > vb) return 1 * mul
      return 0
    })

    return list
  }, [allEvents, query, temporal, typeFilter, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir(key === "dateStart" ? "desc" : "asc")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Registre des événements
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {domain.name} — passés, en cours et à venir.
          </p>
          {!loading && (
            <p className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5">
                {stats.total} au total
              </span>
              {stats.ongoing > 0 && (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-emerald-800">
                  {stats.ongoing} en cours
                </span>
              )}
              <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-primary">
                {stats.upcoming} à venir
              </span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="shrink-0 gap-2" asChild>
            <Link href="/">
              <ArrowLeft className="size-4" />
              Tableau de bord
            </Link>
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Nouvel événement
          </Button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="rounded-md border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="ev-search">Recherche</Label>
            <Input
              id="ev-search"
              placeholder="Événement, client, notes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Période</Label>
            <Select value={temporal} onValueChange={(v) => setTemporal(v as TemporalFilter)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="past">Passés</SelectItem>
                <SelectItem value="ongoing">En cours</SelectItem>
                <SelectItem value="upcoming">À venir</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Mariage">Mariage</SelectItem>
                <SelectItem value="Seminaire">Séminaire</SelectItem>
                <SelectItem value="Soiree privee">Soirée privée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[200px]">
                  <button
                    type="button"
                    className="inline-flex items-center font-semibold hover:text-primary"
                    onClick={() => toggleSort("title")}
                  >
                    Événement
                    <SortIndicator active={sortKey === "title"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="inline-flex items-center font-semibold hover:text-primary"
                    onClick={() => toggleSort("type")}
                  >
                    Type
                    <SortIndicator active={sortKey === "type"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="inline-flex items-center font-semibold hover:text-primary"
                    onClick={() => toggleSort("dateStart")}
                  >
                      Dates
                    <SortIndicator active={sortKey === "dateStart"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead>
                  <span className="font-semibold">Temporalité</span>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="inline-flex items-center font-semibold hover:text-primary"
                    onClick={() => toggleSort("clientOrOrg")}
                  >
                    Client / org.
                    <SortIndicator active={sortKey === "clientOrOrg"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-end font-semibold hover:text-primary"
                    onClick={() => toggleSort("guestCount")}
                  >
                    Invités
                    <SortIndicator active={sortKey === "guestCount"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead>
                  <span className="font-semibold">Statut</span>
                </TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <RegistrySkeleton />
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <p className="text-muted-foreground">
                      {allEvents.length === 0
                        ? "Aucun événement pour le moment."
                        : "Aucun événement ne correspond aux critères."}
                    </p>
                    {allEvents.length === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => setCreateOpen(true)}
                      >
                        <Plus className="mr-1.5 size-4" />
                        Créer le premier événement
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow
                    key={r.id}
                    className="group cursor-pointer"
                    onClick={() => setEditEvent(r)}
                  >
                    <TableCell className="max-w-[240px] whitespace-normal">
                      <span className="font-medium text-foreground">{r.title}</span>
                      {r.notes ? (
                        <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">
                          {r.notes}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-normal", typeBadgeClass(r.type))}>
                        {typeLabel(r.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground">
                      {formatPeriod(r.dateStart, r.dateEnd)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-normal", temporalBadgeClass(r.temporal))}
                      >
                        {temporalLabel(r.temporal)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[180px] whitespace-normal text-muted-foreground">
                      {r.clientOrOrg}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{r.guestCount}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <EventStatusSelect event={r} />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 opacity-60 group-hover:opacity-100"
                            aria-label={`Actions pour ${r.title}`}
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditEvent(r)}>
                            <Pencil className="mr-2 size-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteEvent(r)}
                          >
                            <Trash2 className="mr-2 size-4" />
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
        </div>
        <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
          {loading
            ? "Chargement…"
            : `${rows.length} ligne${rows.length > 1 ? "s" : ""} affichée${rows.length > 1 ? "s" : ""}`}
          {" · "}
          Cliquez sur une ligne pour modifier · statut modifiable en direct
        </p>
      </div>

      <EventFormDialog mode="create" open={createOpen} onOpenChange={setCreateOpen} />

      <EventFormDialog
        mode="edit"
        open={editEvent !== null}
        onOpenChange={(open) => {
          if (!open) setEditEvent(null)
        }}
        event={editEvent}
        onSuccess={() => setEditEvent(null)}
      />

      <EventDeleteDialog
        event={deleteEvent}
        open={deleteEvent !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteEvent(null)
        }}
        onDeleted={() => setDeleteEvent(null)}
      />
    </div>
  )
}
