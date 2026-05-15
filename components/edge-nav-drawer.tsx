"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { VenqorLogo } from "@/components/venqor-logo"
import { cn } from "@/lib/utils"

const CLOSE_DELAY_MS = 380
/** Ouvre aussi quand le curseur entre dans cette zone depuis la page (complète la bande w-3) */
const EDGE_REVEAL_PX = 20

export function EdgeNavDrawer() {
  const pathname = usePathname()
  if (pathname === "/login" || pathname.startsWith("/auth/")) {
    return null
  }
  return <EdgeNavDrawerInner />
}

function EdgeNavDrawerInner() {
  const [open, setOpen] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
      closeTimerRef.current = null
    }, CLOSE_DELAY_MS)
  }, [cancelClose])

  const openDrawer = useCallback(() => {
    cancelClose()
    setOpen(true)
  }, [cancelClose])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelClose()
        setOpen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [cancelClose])

  useEffect(() => {
    return () => cancelClose()
  }, [cancelClose])

  useEffect(() => {
    if (open) return
    const onMove = (e: MouseEvent) => {
      if (e.clientX <= EDGE_REVEAL_PX) openDrawer()
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [open, openDrawer])

  return (
    <>
      {/* Bandeau sensible au survol — bord gauche (desktop / pointeur fin) */}
      <div
        className="pointer-events-auto fixed inset-y-0 left-0 z-[60] hidden w-3 md:block [@media(pointer:coarse)]:md:hidden"
        aria-hidden
        onMouseEnter={openDrawer}
      />

      <aside
        id="edge-nav-drawer"
        aria-hidden={!open}
        aria-label="Navigation latérale"
        className={cn(
          "fixed inset-y-0 left-0 z-[80] hidden w-[min(18rem,88vw)] flex-col border-r border-border bg-card shadow-lg transition-transform duration-300 ease-out md:flex [@media(pointer:coarse)]:md:hidden",
          open ? "pointer-events-auto translate-x-0" : "pointer-events-none -translate-x-full",
        )}
        onMouseEnter={openDrawer}
        onMouseLeave={scheduleClose}
      >
        <div className="border-b border-border px-4 py-4">
          <VenqorLogo size="sm" />
          <p className="mt-2 text-xs text-muted-foreground">Navigation — pages à brancher ici</p>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2" aria-label="Menu principal">
          <Link
            href="/evenements"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Registre des événements
          </Link>
          <Link
            href="/prestataires"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Prestataires du domaine
          </Link>
          <Link
            href="/mes-apps"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Mes applications
          </Link>
          <Link
            href="/catalogue-extras"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Catalogue d&apos;extras
          </Link>
        </nav>
      </aside>

      {/* Voile sous le tiroir : clic ferme (z-index inférieur au panneau) */}
      <button
        type="button"
        aria-label="Fermer le menu"
        tabIndex={-1}
        className={cn(
          "hidden md:block fixed inset-0 z-[70] bg-foreground/10 transition-opacity duration-300 [@media(pointer:coarse)]:md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => {
          cancelClose()
          setOpen(false)
        }}
      />
    </>
  )
}
