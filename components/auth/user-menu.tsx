"use client"

import { useFormStatus } from "react-dom"
import { Loader2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

function SignOutButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant="ghost"
      size="sm"
      disabled={pending}
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

export function UserMenu() {
  return (
    <form action="/auth/logout" method="post">
      <SignOutButton />
    </form>
  )
}
