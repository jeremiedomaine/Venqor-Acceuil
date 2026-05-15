"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { updateEventBookingStatusAction } from "@/app/actions/events"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BOOKING_STATUS_OPTIONS,
  type BookingStatus,
  type DomainEventRecord,
} from "@/lib/domain-events"
import { DOMAIN_EVENTS_CHANGED } from "@/hooks/use-domain-events-sync"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

function bookingTriggerClass(s: BookingStatus) {
  if (s === "Confirmé") return "border-emerald-200 bg-emerald-50 text-emerald-800"
  if (s === "Option") return "border-amber-200 bg-amber-50 text-amber-900"
  return "border-slate-200 bg-muted text-muted-foreground"
}

type EventStatusSelectProps = {
  event: DomainEventRecord
  className?: string
}

export function EventStatusSelect({ event, className }: EventStatusSelectProps) {
  const [value, setValue] = useState(event.bookingStatus)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setValue(event.bookingStatus)
  }, [event.bookingStatus, event.id])

  async function onChange(next: BookingStatus) {
    const prev = value
    setValue(next)
    setPending(true)
    try {
      await updateEventBookingStatusAction(event.id, next)
      window.dispatchEvent(new Event(DOMAIN_EVENTS_CHANGED))
      toast.success("Statut mis à jour.")
    } catch (err) {
      setValue(prev)
      toast.error(
        err instanceof Error ? err.message : "Impossible de mettre à jour le statut.",
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <Select value={value} onValueChange={(v) => void onChange(v as BookingStatus)} disabled={pending}>
      <SelectTrigger
        size="sm"
        className={cn(
          "h-7 w-[7.5rem] border text-xs font-normal shadow-none",
          bookingTriggerClass(value),
          className,
        )}
      >
        {pending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <SelectValue />
        )}
      </SelectTrigger>
      <SelectContent align="end">
        {BOOKING_STATUS_OPTIONS.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
