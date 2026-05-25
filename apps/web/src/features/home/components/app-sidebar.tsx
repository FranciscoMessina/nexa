import {
  IconCalendarEvent,
  IconHome,
  IconLogout,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react"
import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import { NexaLogo } from "@/shared/components/nexa-logo"
import { useAuth } from "@/shared/hooks/useAuth"

type NavItem =
  | {
      label: string
      to: "/"
      icon: typeof IconHome
      testId: string
      disabled?: false
    }
  | {
      label: string
      icon: typeof IconMapPin
      testId: string
      disabled: true
    }

const navItems: Array<NavItem> = [
  { label: "Inicio", to: "/", icon: IconHome, testId: "nav-home" },
  { label: "Mapa", icon: IconMapPin, testId: "nav-map", disabled: true },
  { label: "Mis eventos", icon: IconCalendarEvent, testId: "nav-my-events", disabled: true },
  { label: "Mi perfil", icon: IconUser, testId: "nav-profile", disabled: true },
]

export function AppSidebar() {
  const { logout } = useAuth()
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <aside
      className="hidden w-64 shrink-0 flex-col border-r border-[#e8edf5] bg-[#f7f9fd] px-5 py-6 lg:flex"
      data-testid="app-sidebar"
    >
      <NexaLogo className="shrink-0" variant="compact" />

      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = !("disabled" in item) && pathname === item.to
          const Icon = item.icon

          if ("disabled" in item) {
            return (
              <span
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#8a9bb8] opacity-60"
                data-testid={item.testId}
                key={item.label}
              >
                <Icon size={20} stroke={1.8} />
                {item.label}
              </span>
            )
          }

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                isActive
                  ? "bg-[#fff0eb] text-[#e85a2f]"
                  : "text-[#1a3462] hover:bg-white"
              )}
              data-testid={item.testId}
              key={item.label}
              to={item.to}
            >
              <Icon size={20} stroke={1.8} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-4 pt-6">
        <button
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1a3462] transition hover:bg-white"
          data-testid="nav-logout"
          onClick={logout}
          type="button"
        >
          <IconLogout size={20} stroke={1.8} />
          Cerrar sesión
        </button>

        <div
          className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm"
          data-testid="sidebar-promo-card"
        >
          <div className="absolute right-0 bottom-0 left-0 h-14 bg-linear-to-r from-[#ff6b3d] via-[#ff8a4c] to-[#f8ba1f] opacity-90" />
          <p className="relative z-10 text-xs font-bold tracking-[0.16em] text-[#102e60] uppercase">
            Nuevos <span className="text-[#f4a318]">planes</span>.
            <br />
            Nuevas <span className="text-[#ff6f3d]">conexiones</span>.
          </p>
        </div>
      </div>
    </aside>
  )
}
