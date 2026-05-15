import { cn } from "@/lib/utils"

type VenqorLogoProps = {
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "text-lg tracking-tight",
  md: "text-xl tracking-tight",
  lg: "text-2xl tracking-tight md:text-3xl",
}

/** Typographic wordmark: Ven (indigo) + qor. (slate) — no gap, Inter ExtraBold via parent font-weight */
export function VenqorLogo({ className, size = "md" }: VenqorLogoProps) {
  return (
    <span
      className={cn(
        "font-extrabold leading-none",
        sizeClasses[size],
        className,
      )}
      aria-label="Venqor"
    >
      <span className="text-[#4F46E5]">Ven</span>
      <span className="text-[#0F172A]">qor.</span>
    </span>
  )
}
