import { Link, createFileRoute } from "@tanstack/react-router"
import { EventCard, mockEvents } from "@/features/events"
import { useAuth } from "@/shared/hooks/useAuth"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const { user, isHydrated, isAuthenticated, currentUserRole, logout } = useAuth()

  return (
    <main className="min-h-svh bg-[#f7f9fd] p-6 sm:p-10">
      <div className="mx-auto max-w-7xl rounded-3xl border border-[#dfe7f5] bg-white p-8 shadow-[0_20px_65px_-45px_rgba(13,37,84,0.55)]">
        <div className="flex flex-wrap justify-end gap-3">
          {currentUserRole === "organizador" ? (
            <Link
              className="rounded-xl border border-[#cfd9ea] px-5 py-2.5 font-semibold text-[#1a3768] hover:bg-[#eef3fb]"
              to="/dashboard"
            >
              Ir a dashboard
            </Link>
          ) : null}

          <button
            className="rounded-xl border border-[#cfd9ea] px-5 py-2.5 font-semibold text-[#1a3768] hover:bg-[#eef3fb]"
            data-testid="home-logout-button"
            onClick={logout}
            type="button"
          >
            Cerrar sesion
          </button>
        </div>

        <h1 className="text-3xl font-bold text-[#0f2c5a]">Nexa App</h1>

        <p className="mt-2 text-[#607496]">
          Estado global de sesion mock para emprendedor, organizador y asistente.
        </p>

        <div className="mt-6 rounded-2xl bg-[#f3f7ff] p-5" data-testid="session-state-card">
          {!isHydrated ? (
            <p className="text-[#1a3768]">Cargando sesion...</p>
          ) : null}

          {isHydrated && !isAuthenticated ? (
            <p className="text-[#1a3768]">No hay usuario autenticado.</p>
          ) : null}

          {isHydrated && isAuthenticated ? (
            <div className="space-y-1">
              <p className="text-[#1a3768]">
                Usuario: <strong>{user?.displayName}</strong>
              </p>
              <p className="text-[#1a3768]">
                Correo: <strong>{user?.email}</strong>
              </p>
              <p className="text-[#1a3768]">
                Rol actual: <strong>{currentUserRole}</strong>
              </p>
            </div>
          ) : null}
        </div>

        <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </section>
      </div>
    </main>
  )
}
