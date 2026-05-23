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
        className={cn("h-auto w-full max-w-[11.5rem]", className)}
        data-testid="nexa-logo"
        src={NEXA_LOGO_SRC}
      />
    )
  }

  return (
    <div
      className={cn("h-[5.65rem] w-[9.5rem] overflow-hidden", className)}
      data-testid="nexa-logo"
    >
      <img
        alt="nexa"
        className="w-[9.5rem] max-w-none"
        src={NEXA_LOGO_SRC}
      />
    </div>
  )
}
