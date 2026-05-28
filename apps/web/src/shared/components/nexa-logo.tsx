import { cn } from "@workspace/ui/lib/utils"

export const NEXA_LOGO_SRC = "/nexa-logo.png"

type NexaLogoProps = {
  className?: string
  variant?: "compact" | "full"
}

export function NexaLogo({ className, variant = "compact" }: NexaLogoProps) {
  if (variant === "full") {
    return (
      <img
        alt="nexa - Nuevos planes. Nuevas conexiones."
        className={cn("h-auto w-full max-w-46", className)}
        data-testid="nexa-logo"
        src={NEXA_LOGO_SRC.replace(".png", "-svg.svg")}
      />
    )
  }

  return (
    <div className={cn("w-38", className)} data-testid="nexa-logo">
      <img
        alt="nexa"
        className="w-38 max-w-none"
        src={NEXA_LOGO_SRC.replace(".png", "-svg.svg")}
      />
    </div>
  )
}
