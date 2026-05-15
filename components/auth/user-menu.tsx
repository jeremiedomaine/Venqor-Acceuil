"use client"

import { LogOut } from "lucide-react"
import { signOutAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"

export function UserMenu() {
  return (
    <form action={signOutAction}>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 border border-white/20 bg-white/10 px-2.5 text-xs font-medium text-white hover:bg-white/20 hover:text-white"
      >
        <LogOut className="size-3.5" />
        Déconnexion
      </Button>
    </form>
  )
}
