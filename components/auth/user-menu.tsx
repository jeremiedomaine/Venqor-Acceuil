"use client"

import { useState } from "react"
import { Loader2, LogOut } from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function UserMenu() {
  const [pending, setPending] = useState(false)

  async function handleSignOut() {
    if (pending) return
    setPending(true)
    try {
      const supabase = createBrowserSupabaseClient()
      const { error } = await supabase.auth.signOut({ scope: "global" })
      if (error) {
        console.error("[signOut]", error.message)
      }
    } catch (err) {
      console.error("[signOut]", err)
    } finally {
      // Navigation complète pour que le middleware relise les cookies effacés
      window.location.assign("/login")
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => void handleSignOut()}
      className="h-8 gap-1.5 border border-white/20 bg-white/10 px-2.5 text-xs font-medium text-white hover:bg-white/20 hover:text-white disabled:opacity-70"
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
