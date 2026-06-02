import { Link } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"
import { useRequireAuthentication } from "@/features/auth"
import { EventCard } from "@/features/events/components/event-card"
import { getMyEventsCopy } from "@/features/events/data/my-events-copy"
import { useMyEventsSectionsQuery } from "@/features/events/hooks/events-queries"
import { toEventItem } from "@/features/events/utils/event-item.utils"
import type { EventItem } from "@/features/events/types/event.types"
import { AppShell } from "@/features/home/components/app-shell"
import { useAuth } from "@/shared/hooks/useAuth"

type MyEventsTab = "upcoming" | "past"

function SectionEmptyState({
  description,
  showExploreLink,
  title,
}: {
  description: string
  showExploreLink?: boolean
  title: string
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d5deed] bg-white px-6 py-14 text-center">
      <p className="text-lg font-semibold text-[#1a3462]">{title}</p>
      <p className="mt-2 text-sm text-[#6b7d9c]">{description}</p>
      {showExploreLink ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            className="inline-flex rounded-xl border border-[#d5deed] px-5 py-2.5 text-sm font-semibold text-[#1a3462] transition hover:bg-[#f4f7fb]"
            to="/"
          >
            Explorar eventos
          </Link>
          <Link
            className="inline-flex rounded-xl bg-[#6d5ae6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f4ad4]"
            to="/crear-evento"
          >
            Crear evento
          </Link>
        </div>
      ) : null}
    </div>
  )
}

function SectionPanel({
  emptyDescription,
  emptyTitle,
  events,
  showExploreLink,
  testId,
}: {
  emptyDescription: string
  emptyTitle: string
  events: Array<EventItem>
  showExploreLink?: boolean
  testId: string
}) {
  if (events.length === 0) {
    return (
      <div data-testid={testId}>
        <SectionEmptyState
          description={emptyDescription}
          showExploreLink={showExploreLink}
          title={emptyTitle}
        />
      </div>
    )
  }

  return (
    <div
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      data-testid={testId}
    >
      {events.map((event) => (
        <EventCard event={event} key={event.id} />
      ))}
    </div>
  )
}

export function MyEventsPage() {
  const { user, currentUserRole } = useAuth()
  const { isChecking, isAllowed } = useRequireAuthentication({
    allowedRoles: ["emprendedor", "asistente", "organizador"],
  })
  const [activeTab, setActiveTab] = useState<MyEventsTab>("upcoming")
  const { data: sections, isLoading } = useMyEventsSectionsQuery(isAllowed)

  if (isChecking) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#faf7f2] p-6">
        <p className="text-[#1a3462]">Cargando...</p>
      </main>
    )
  }

  if (!isAllowed || !user || !currentUserRole) {
    return null
  }

  const copy = getMyEventsCopy(currentUserRole)
  const upcoming = (sections?.upcoming ?? []).map(toEventItem)
  const past = (sections?.past ?? []).map(toEventItem)
  const activeEvents = activeTab === "upcoming" ? upcoming : past

  return (
    <AppShell>
      <div className="space-y-6" data-testid="my-events-page">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2558] lg:text-4xl">Mis eventos</h1>
          <p className="mt-2 text-base text-[#6b7d9c]">{copy.subtitle}</p>
        </div>

        <div className="flex gap-2 rounded-2xl border border-[#e8edf5] bg-white p-2">
          {(["upcoming", "past"] as const).map((tab) => (
            <button
              className={cn(
                "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                activeTab === tab
                  ? "bg-[#6d5ae6] text-white"
                  : "text-[#6b7d9c] hover:bg-[#f4f7fb]"
              )}
              data-testid={`my-events-tab-${tab}`}
              key={tab}
              onClick={() => {
                setActiveTab(tab)
              }}
              type="button"
            >
              {tab === "upcoming" ? copy.upcomingTitle : copy.pastTitle}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-sm text-[#6b7d9c]">Cargando tus eventos...</p>
        ) : (
          <SectionPanel
            emptyDescription={
              activeTab === "upcoming"
                ? copy.upcomingEmptyDescription
                : copy.pastEmptyDescription
            }
            emptyTitle={
              activeTab === "upcoming" ? copy.upcomingEmptyTitle : copy.pastEmptyTitle
            }
            events={activeEvents}
            showExploreLink={activeTab === "upcoming"}
            testId={activeTab === "upcoming" ? "my-events-upcoming" : "my-events-past"}
          />
        )}
      </div>
    </AppShell>
  )
}
