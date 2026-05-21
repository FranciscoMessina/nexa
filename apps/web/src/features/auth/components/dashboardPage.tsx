import { Link } from "@tanstack/react-router"
import { useRequireAuthentication } from "@/features/auth/hooks/useAuthRedirect"
import { useAuth } from "@/shared/hooks/useAuth"

export function DashboardPage() {
  const { user, logout } = useAuth()
  const { isChecking, isAllowed } = useRequireAuthentication({
    allowedRoles: ["organizador"],
  })

  if (isChecking) {
    return (
      <main className="grid min-h-svh place-items-center p-6">
        <p className="text-[#1a3462]">Cargando sesion...</p>
      </main>
    )
  }

  if (!isAllowed) {
    return null
  }

  return (
    <main className="min-h-svh bg-[#f7f9fd] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[#dfe6f3] bg-white p-8 shadow-[0_20px_65px_-45px_rgba(12,35,75,0.55)]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-[#102b58]">Dashboard de organizador</h1>
          <button
            className="rounded-xl border border-[#d3deef] px-4 py-2 font-semibold text-[#1a3563] hover:bg-[#edf2fb]"
            data-testid="logout-button"
            onClick={logout}
            type="button"
          >
            Cerrar sesion
          </button>
        </div>

        <div className="rounded-2xl bg-linear-to-r from-[#f8bd21] to-[#ff7442] p-5 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-white/90">Sesion activa</p>
          <p className="mt-2 text-2xl font-semibold">{user?.displayName ?? "Organizador"}</p>
          <p className="text-white/90">Rol actual: {user?.role ?? "organizador"}</p>
        </div>

        <Link className="mt-6 inline-flex font-semibold text-[#ff6f3d] hover:text-[#e2582d]" to="/">
          Ir al inicio
        </Link>
      </div>
    </main>
  )
}
