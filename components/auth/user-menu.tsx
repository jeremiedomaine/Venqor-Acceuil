"use client"

import { useState } from "react"
import { Loader2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UserMenu() {
  const [pending, setPending] = useState(false)

  function handleSignOut() {
    if (pending) return
    setPending(true)
    // Déconnexion côté serveur (cookies) puis redirect vers /login
    window.location.href = "/auth/logout"
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={handleSignOut}
      className="relative z-30 h-8 cursor-pointer gap-1.5 border border-white/20 bg-white/10 px-2.5 text-xs font-medium text-white hover:bg-white/20 hover:text-white disabled:opacity-70"
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <LogOut className="size-3.5" />
      )}
      {pending ? "Déconnexion…" : "Déconnexion"}
    </Button>
  )
}
