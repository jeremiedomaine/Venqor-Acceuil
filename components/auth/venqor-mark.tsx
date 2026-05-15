import Image from "next/image"
import { cn } from "@/lib/utils"

type VenqorMarkProps = {
  className?: string
  size?: "md" | "lg"
}

export function VenqorMark({ className, size = "lg" }: VenqorMarkProps) {
  const dim = size === "lg" ? 56 : 44
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src="/icon.png"
        alt=""
        width={dim}
        height={dim}
        className="shrink-0"
        priority
      />
      <span className="text-left leading-none">
        <span className="block text-2xl font-extrabold tracking-tight text-white">
          <span className="text-indigo-300">Ven</span>
          <span>qor</span>
        </span>
        <span className="mt-1 block text-xs font-medium text-white/60">
          Espace domaine
        </span>
      </span>
    </span>
  )
}
