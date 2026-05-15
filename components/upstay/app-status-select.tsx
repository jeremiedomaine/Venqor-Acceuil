"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { updateDomainAppStatusAction } from "@/app/actions/domain-apps"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DOMAIN_APP_STATUS_OPTIONS } from "@/lib/data/domain-apps"
import type { DomainApp, DomainAppStatus } from "@/lib/domain-apps"
import { DOMAIN_APPS_CHANGED } from "@/hooks/use-domain-apps-sync"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

function statusTriggerClass(s: DomainAppStatus) {
  if (s === "Actif") return "border-emerald-200 bg-emerald-50 text-emerald-800"
  if (s === "Brouillon") return "border-amber-200 bg-amber-50 text-amber-900"
  return "border-slate-200 bg-muted text-muted-foreground"
}

type AppStatusSelectProps = {
  app: DomainApp
  className?: string
}

export function AppStatusSelect({ app, className }: AppStatusSelectProps) {
  const [value, setValue] = useState(app.status)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setValue(app.status)
  }, [app.status, app.id])

  async function onChange(next: DomainAppStatus) {
    const prev = value
    setValue(next)
    setPending(true)
    try {
      await updateDomainAppStatusAction(app.id, next)
      window.dispatchEvent(new Event(DOMAIN_APPS_CHANGED))
      toast.success("Statut mis à jour.")
    } catch (err) {
      setValue(prev)
      toast.error(err instanceof Error ? err.message : "Impossible de mettre à jour.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Select value={value} onValueChange={(v) => void onChange(v as DomainAppStatus)} disabled={pending}>
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
        {DOMAIN_APP_STATUS_OPTIONS.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
