import {
  IconCalendarEvent,
  IconCirclePlus,
  IconHome,
  IconLogout,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react"
import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import { NexaLogo } from "@/shared/components/nexa-logo"
import { useAuth } from "@/shared/hooks/useAuth"

type NavItem = {
  label: string
  to: "/" | "/perfil" | "/crear-evento" | "/mis-eventos" | "/mapa"
  icon: typeof IconHome
  testId: string
}

const navItems: Array<NavItem> = [
  { label: "Inicio", to: "/", icon: IconHome, testId: "nav-home" },
  { label: "Mapa", to: "/mapa", icon: IconMapPin, testId: "nav-map" },
  {
    label: "Crear evento",
    to: "/crear-evento",
    icon: IconCirclePlus,
    testId: "nav-create-event",
  },
  {
    label: "Mis eventos",
    to: "/mis-eventos",
    icon: IconCalendarEvent,
    testId: "nav-my-events",
  },
  { label: "Mi perfil", to: "/perfil", icon: IconUser, testId: "nav-profile" },
]

export function AppSidebar() {
  const { logout } = useAuth()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <aside
      className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#f3dfa8] bg-[linear-gradient(180deg,#fffef9_0%,#fff8dd_24%,#ffe4c8_52%,#ffc894_78%,#ff9f5c_100%)] px-5 py-6 lg:flex"
      data-testid="app-sidebar"
    >
      <NexaLogo className="mx-auto h-18 shrink-0" variant="compact" />

      <nav className="mt-22 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.to
          const Icon = item.icon

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                isActive
                  ? "bg-white/95 text-[#e85a2f] shadow-sm"
                  : "text-[#1a3462] hover:bg-white/55"
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
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1a3462] transition hover:bg-white/55"
          data-testid="nav-logout"
          onClick={logout}
          type="button"
        >
          <IconLogout size={20} stroke={1.8} />
          Cerrar sesión
        </button>

        <div
          className="overflow-hidden rounded-2xl border border-white/70 bg-white/92 p-4 shadow-[0_12px_32px_-16px_rgba(180,72,20,0.35)] backdrop-blur-[2px]"
          data-testid="sidebar-promo-card"
        >
          <p className="text-xs font-bold tracking-[0.16em] text-[#102e60] uppercase">
            Nuevos <span className="text-[#1a3462]">planes</span>.
            <br />
            Nuevas <span className="text-[#1a3462]">conexiones</span>.
          </p>
          <div
            aria-hidden
            className="mt-3 h-1.5 rounded-full bg-linear-to-r from-[#ff6b3d] via-[#ff8a4c] to-[#f8ba1f]"
          />
        </div>
      </div>
    </aside>
  )
}
