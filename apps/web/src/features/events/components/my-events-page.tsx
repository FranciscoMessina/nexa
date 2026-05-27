import { useMemo } from "react"
import { Link } from "@tanstack/react-router"
import { useRequireAuthentication } from "@/features/auth"
import { EventCard } from "@/features/events/components/event-card"
import { getMyEventsCopy, getMyEventsForUser } from "@/features/events/data/my-events"
import { AppShell } from "@/features/home/components/app-shell"
import { getMockProfileForEmail } from "@/features/profiles/data/mock-profiles"
import { useAuth } from "@/shared/hooks/useAuth"

export function MyEventsPage() {
  const { user, currentUserRole } = useAuth()
  const { isChecking, isAllowed } = useRequireAuthentication({
    allowedRoles: ["asistente", "organizador", "emprendedor"],
  })

  const profileId = user ? getMockProfileForEmail(user.email)?.id : undefined

  const events = useMemo(
    () => getMyEventsForUser(profileId, currentUserRole),
    [currentUserRole, profileId]
  )

  const copy = currentUserRole ? getMyEventsCopy(currentUserRole) : getMyEventsCopy("asistente")

  if (isChecking) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#f4f6fa] p-6">
        <p className="text-[#1a3462]">Cargando tus eventos...</p>
      </main>
    )
  }

  if (!isAllowed) {
    return null
  }

  return (
    <AppShell>
      <div className="space-y-6" data-testid="my-events-page">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2558] lg:text-4xl">Mis eventos</h1>
          <p className="mt-2 text-base text-[#6b7d9c]">{copy.subtitle}</p>
        </div>

        {events.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed border-[#d5deed] bg-white px-6 py-16 text-center"
            data-testid="my-events-empty"
          >
            <p className="text-lg font-semibold text-[#1a3462]">{copy.emptyTitle}</p>
            <p className="mt-2 text-sm text-[#6b7d9c]">{copy.emptyDescription}</p>
            {currentUserRole === "asistente" ? (
              <Link
                className="mt-6 inline-flex rounded-xl bg-[#6d5ae6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f4ad4]"
                to="/"
              >
                Explorar eventos
              </Link>
            ) : null}
          </div>
        ) : (
          <div
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            data-testid="my-events-grid"
          >
            {events.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
