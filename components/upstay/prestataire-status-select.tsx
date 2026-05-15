"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { updatePrestataireStatusAction } from "@/app/actions/prestataires"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PRESTATAIRE_STATUS_OPTIONS } from "@/lib/data/prestataires"
import type { PrestataireRecord, PrestataireStatus } from "@/lib/prestataires"
import { DOMAIN_PRESTATAIRES_CHANGED } from "@/hooks/use-prestataires-sync"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

function statusTriggerClass(s: PrestataireStatus) {
  if (s === "Actif") return "border-emerald-200 bg-emerald-50 text-emerald-800"
  if (s === "Suspendu") return "border-red-200 bg-red-50 text-red-800"
  return "border-amber-200 bg-amber-50 text-amber-900"
}

type PrestataireStatusSelectProps = {
  prestataire: PrestataireRecord
  className?: string
}

export function PrestataireStatusSelect({ prestataire, className }: PrestataireStatusSelectProps) {
  const [value, setValue] = useState(prestataire.status)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setValue(prestataire.status)
  }, [prestataire.status, prestataire.id])

  async function onChange(next: PrestataireStatus) {
    const prev = value
    setValue(next)
    setPending(true)
    try {
      await updatePrestataireStatusAction(prestataire.id, next)
      window.dispatchEvent(new Event(DOMAIN_PRESTATAIRES_CHANGED))
      toast.success("Statut mis à jour.")
    } catch (err) {
      setValue(prev)
      toast.error(err instanceof Error ? err.message : "Impossible de mettre à jour.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Select value={value} onValueChange={(v) => void onChange(v as PrestataireStatus)} disabled={pending}>
      <SelectTrigger
        size="sm"
        className={cn(
          "h-7 w-[7.5rem] border text-xs font-normal shadow-none",
          statusTriggerClass(value),
          className,
        )}
      >
        {pending ? <Loader2 className="size-3.5 animate-spin" /> : <SelectValue />}
      </SelectTrigger>
      <SelectContent align="end">
        {PRESTATAIRE_STATUS_OPTIONS.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
