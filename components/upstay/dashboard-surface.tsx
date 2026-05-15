import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const surfaceBase =
  "overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm shadow-slate-900/[0.04] transition-[box-shadow,border-color] duration-300 ease-out"

export function DashboardSurface({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(surfaceBase, className)} {...props} />
}

export function dashboardPanelClass(hover = false) {
  return cn(
    surfaceBase,
    hover &&
      "hover:border-border/90 hover:shadow-sm hover:shadow-slate-900/[0.06]",
  )
}
