import { IconBell, IconChevronDown } from "@tabler/icons-react"
import { NexaLogo } from "@/shared/components/nexa-logo"
import { useAuth } from "@/shared/hooks/useAuth"

function getUserInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/)

  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
  }

  return displayName.slice(0, 2).toUpperCase()
}

export function AppHeader() {
  const { user } = useAuth()
  const displayName = user?.displayName ?? "Usuario"

  return (
    <header
      className="flex items-center justify-between gap-4 border-b border-[#e8edf5] bg-white px-4 py-4 lg:px-8"
      data-testid="app-header"
    >
      <NexaLogo className="lg:hidden" variant="compact" />

      <div className="ml-auto flex items-center gap-4">
        <button
          aria-label="Notificaciones"
          className="relative rounded-full p-2 text-[#1a3462] transition hover:bg-[#f3f7ff]"
          data-testid="notifications-button"
          type="button"
        >
          <IconBell size={22} stroke={1.8} />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#ff6b3d]" />
        </button>

        <button
          className="flex items-center gap-3 rounded-full border border-[#e8edf5] bg-[#f9fafc] py-1 pr-2 pl-1 transition hover:bg-[#f3f7ff]"
          data-testid="user-menu-button"
          type="button"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-[#ffc96b] to-[#ff8f6b] text-sm font-bold text-white">
            {getUserInitials(displayName)}
          </span>
          <span className="hidden text-sm font-semibold text-[#1a3462] sm:inline">
            {displayName}
          </span>
          <IconChevronDown className="hidden text-[#8a9bb8] sm:block" size={16} stroke={2} />
        </button>
      </div>
    </header>
  )
}
