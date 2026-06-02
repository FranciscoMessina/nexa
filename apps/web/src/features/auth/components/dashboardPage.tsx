import { Link } from "@tanstack/react-router"
import { useRequireAuthentication } from "@/features/auth/hooks/useAuthRedirect"
import { AppShell } from "@/features/home/components/app-shell"
import { useAuth } from "@/shared/hooks/useAuth"
import { DashboardSkeleton } from "@/shared/components/skeletons/form-page-skeleton"

export function DashboardPage() {
  const { user, logout } = useAuth()
  const { isChecking, isAllowed } = useRequireAuthentication({
    allowedRoles: ["organizador"],
  })

  if (!isChecking && !isAllowed) {
    return null
  }

  if (isChecking) {
    return (
      <AppShell>
        <DashboardSkeleton />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-white/70 bg-white/90 px-6 py-5 shadow-[0_18px_70px_-48px_rgba(20,31,64,0.48)] backdrop-blur sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#102b58]">Dashboard de organizador</h1>
              <p className="mt-2 text-sm text-[#6a7690]">
                Hola {user?.displayName ?? "Organizador"}, estos son los eventos destacados de hoy.
              </p>
            </div>
            <button
              className="rounded-xl border border-[#d3deef] px-4 py-2 font-semibold text-[#1a3563] hover:bg-[#edf2fb]"
              data-testid="logout-button"
              onClick={logout}
              type="button"
            >
              Cerrar sesion
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e4ebf7] bg-white px-5 py-4 text-sm text-[#5f6f8b] shadow-[0_16px_50px_-42px_rgba(12,35,75,0.35)]">
          <p>
            Rol actual: <span className="font-semibold text-[#1a3563]">{user?.role ?? "organizador"}</span>
          </p>
        </div>

        <Link
          className="inline-flex font-semibold text-[#5b4bb7] hover:text-[#3f3485]"
          to="/perfil"
        >
          Ir a mi perfil
        </Link>
      </div>
    </AppShell>
  )
}
