"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  type DomainEventRecord,
  type DomainEventTemporal,
  type DomainEventType,
} from "@/lib/domain-events"
import { useDomainEventsSync } from "@/hooks/use-domain-events-sync"
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

function bookingBadgeClass(s: DomainEventRecord["bookingStatus"]) {
  if (s === "Confirmé") return "border-emerald-200 bg-emerald-50 text-emerald-800"
  if (s === "Option") return "border-amber-200 bg-amber-50 text-amber-900"
  return "border-slate-200 bg-muted text-muted-foreground"
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

export function DomainEventsRegistry() {
  const { events: allEvents, loading, error } = useDomainEventsSync()
  const [query, setQuery] = useState("")
  const [temporal, setTemporal] = useState<TemporalFilter>("all")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [sortKey, setSortKey] = useState<SortKey>("dateStart")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

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
          r.clientOrOrg.toLowerCase().includes(q),
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Registre des événements
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Domaine des lauriers de la Bastide — passés, en cours et à venir.
          </p>
        </div>
        <Button variant="outline" size="sm" className="w-fit shrink-0" asChild>
          <Link href="/" className="gap-2">
            <ArrowLeft className="size-4" />
            Tableau de bord
          </Link>
        </Button>
      </div>

      <div className="rounded-md border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="ev-search">Recherche</Label>
            <Input
              id="ev-search"
              placeholder="Événement, client, société…"
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

      <div className="rounded-md border border-border bg-card shadow-sm">
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
                <button
                  type="button"
                  className="inline-flex items-center font-semibold hover:text-primary"
                  onClick={() => toggleSort("bookingStatus")}
                >
                  Statut résa.
                  <SortIndicator active={sortKey === "bookingStatus"} dir={sortDir} />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Aucun événement ne correspond aux critères.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="max-w-[240px] whitespace-normal font-medium text-foreground">
                    {r.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-normal", typeBadgeClass(r.type))}>
                      {r.type === "Soiree privee" ? "Soirée privée" : r.type === "Seminaire" ? "Séminaire" : r.type}
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
                  <TableCell>
                    <Badge variant="outline" className={cn("font-normal", bookingBadgeClass(r.bookingStatus))}>
                      {r.bookingStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
          {rows.length} ligne{rows.length > 1 ? "s" : ""} affichée{rows.length > 1 ? "s" : ""}
          {" · "}
          Tri et filtres type CRM — synchronisé avec le tableau de bord.
        </p>
      </div>
    </div>
  )
}
