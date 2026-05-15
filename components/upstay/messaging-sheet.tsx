"use client"

import { useEffect, useMemo, useState } from "react"
import { MESSAGING_CLIENTS, type MessagingClient } from "@/lib/messaging-clients"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

type MessagingSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function initials(name: string) {
  const p = name.split(/\s+/).filter(Boolean)
  if (p.length >= 2) return (p[0]![0]! + p[1]![0]!).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

/** Bulles de démo pour le client sélectionné */
function demoThread(client: MessagingClient) {
  return [
    { id: "m1", from: "them" as const, text: client.lastMessage },
    {
      id: "m2",
      from: "us" as const,
      text: "Bonjour, merci pour votre message. L’équipe du domaine vous répond sous 24 h.",
    },
    {
      id: "m3",
      from: "them" as const,
      text: "Très bien, j’attends votre confirmation.",
    },
  ]
}

export function MessagingSheet({ open, onOpenChange }: MessagingSheetProps) {
  const [selectedId, setSelectedId] = useState(MESSAGING_CLIENTS[0]!.id)

  const selected = useMemo(
    () => MESSAGING_CLIENTS.find((c) => c.id === selectedId) ?? MESSAGING_CLIENTS[0]!,
    [selectedId],
  )

  useEffect(() => {
    if (!open) return
    const firstUnread = MESSAGING_CLIENTS.find((c) => c.unread > 0)
    setSelectedId(firstUnread?.id ?? MESSAGING_CLIENTS[0]!.id)
  }, [open])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l p-0 sm:max-w-2xl lg:max-w-4xl [&>button]:z-10"
      >
        <SheetHeader className="border-b border-border px-6 py-4 text-left">
          <SheetTitle className="text-lg tracking-tight">Messagerie</SheetTitle>
          <SheetDescription>
            Conversations avec vos clients — {MESSAGING_CLIENTS.length} contacts.
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <div className="flex max-h-[40vh] flex-col border-b border-border md:max-h-none md:w-[min(20rem,100%)] md:border-r md:border-b-0">
            <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Clients
            </p>
            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
              <ul className="flex flex-col gap-0.5">
                {MESSAGING_CLIENTS.map((c) => {
                  const active = c.id === selected.id
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(c.id)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                          active ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted",
                        )}
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                          {initials(c.name)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate font-medium text-foreground">{c.name}</span>
                            {c.unread > 0 ? (
                              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                                {c.unread}
                              </span>
                            ) : null}
                          </span>
                          {c.company ? (
                            <span className="block truncate text-xs text-muted-foreground">{c.company}</span>
                          ) : null}
                          <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {c.lastMessage}
                          </span>
                          <span className="mt-1 text-[10px] text-muted-foreground">{c.lastAtLabel}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          <div className="flex min-h-[45vh] flex-1 flex-col md:min-h-0">
            <div className="border-b border-border px-4 py-3">
              <p className="font-semibold text-foreground">{selected.name}</p>
              <p className="text-xs text-muted-foreground">{selected.email}</p>
              {selected.company ? (
                <p className="text-xs text-muted-foreground">{selected.company}</p>
              ) : null}
            </div>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {demoThread(selected).map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "max-w-[85%] rounded-md px-3 py-2 text-sm leading-relaxed",
                    m.from === "us"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input placeholder="Écrire un message… (démo)" disabled className="flex-1" />
                <Button type="button" disabled>
                  Envoyer
                </Button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Envoi désactivé — branchement API à prévoir.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
