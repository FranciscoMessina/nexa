import { useRequireAuthentication } from "@/features/auth"
import { EventFilters, EventGrid, EventRecommendationBanner } from "@/features/events"
import { AppShell } from "@/features/home/components/app-shell"

export function HomePage() {
  const { isChecking, isAllowed } = useRequireAuthentication({
    allowedRoles: ["emprendedor", "asistente", "organizador"],
  })

  if (!isChecking && !isAllowed) {
    return null
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2558] lg:text-4xl">
            Muro de eventos
          </h1>
          <p className="mt-2 text-base text-[#6b7d9c]">
            Descubrí eventos verificados y comunitarios cerca de vos.
          </p>
        </div>

        <EventRecommendationBanner enabled={isAllowed} />
        <EventFilters />
        <EventGrid />
      </div>
    </AppShell>
  )
}
