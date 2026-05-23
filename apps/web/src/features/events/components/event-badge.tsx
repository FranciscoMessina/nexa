import { IconShieldCheck, IconUsers } from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"
import type { EventKind } from "@/features/events/types/event.types"

type EventBadgeProps = {
  kind: EventKind
}

const badgeConfig: Record<
  EventKind,
  { label: string; icon: typeof IconShieldCheck }
> = {
  verified: { label: "Evento verificado", icon: IconShieldCheck },
  community: { label: "Evento comunitario", icon: IconUsers },
}

export function EventBadge({ kind }: EventBadgeProps) {
  const { label, icon: Icon } = badgeConfig[kind]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1",
        "text-xs font-semibold text-[#5b4bb7] shadow-sm"
      )}
      data-testid={`event-badge-${kind}`}
    >
      <Icon size={14} stroke={2} />
      {label}
    </span>
  )
}
