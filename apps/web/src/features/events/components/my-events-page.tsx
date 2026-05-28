import { Link } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useState } from "react"
import { useRequireAuthentication } from "@/features/auth"
import { EventCard } from "@/features/events/components/event-card"
import {
  getMyEventsCopy,
  getMyEventsSections,
} from "@/features/events/data/my-events"
import { useEventAttendanceStore } from "@/features/events/stores/event-attendance.store"
import type { EventItem } from "@/features/events/types/event.types"
import { AppShell } from "@/features/home/components/app-shell"
import { getMockProfileForEmail } from "@/features/profiles/data/mock-profiles"
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
    allowedRoles: ["asistente", "organizador", "emprendedor"],
  })
  const hydrate = useEventAttendanceStore((state) => state.hydrate)
  const isHydrated = useEventAttendanceStore((state) => state.isHydrated)
  const attendingByProfile = useEventAttendanceStore(
    (state) => state.byProfileId
  )
  const [activeTab, setActiveTab] = useState<MyEventsTab>("upcoming")

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const profileId = user ? getMockProfileForEmail(user.email)?.id : undefined
  const attendingEventIds = profileId
    ? (attendingByProfile[profileId] ?? [])
    : []

  const sections =
    isHydrated && profileId && currentUserRole
      ? getMyEventsSections(profileId, currentUserRole, attendingEventIds)
      : { upcoming: [], past: [] }

  const copy = currentUserRole
    ? getMyEventsCopy(currentUserRole)
    : getMyEventsCopy("asistente")

  if (isChecking) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#faf7f2] p-6">
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
          <h1 className="text-3xl font-bold text-[#0a2558] lg:text-4xl">
            Mis eventos
          </h1>
          <p className="mt-2 text-base text-[#6b7d9c]">{copy.subtitle}</p>
        </div>

        <div
          className="inline-flex w-full max-w-md rounded-2xl border border-[#e8edf5] bg-white p-1 shadow-sm"
          role="tablist"
        >
          <button
            aria-selected={activeTab === "upcoming"}
            className={cn(
              "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
              activeTab === "upcoming"
                ? "bg-[#fff0eb] text-[#e85a2f] shadow-sm"
                : "text-[#1a3462] hover:bg-[#f9fbff]"
            )}
            data-testid="my-events-tab-upcoming"
            onClick={() => {
              setActiveTab("upcoming")
            }}
            role="tab"
            type="button"
          >
            {copy.upcomingTitle}
            <span className="ml-1.5 text-xs font-medium opacity-80">
              ({sections.upcoming.length})
            </span>
          </button>

          <button
            aria-selected={activeTab === "past"}
            className={cn(
              "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
              activeTab === "past"
                ? "bg-[#fff0eb] text-[#e85a2f] shadow-sm"
                : "text-[#1a3462] hover:bg-[#f9fbff]"
            )}
            data-testid="my-events-tab-past"
            onClick={() => {
              setActiveTab("past")
            }}
            role="tab"
            type="button"
          >
            {copy.pastTitle}
            <span className="ml-1.5 text-xs font-medium opacity-80">
              ({sections.past.length})
            </span>
          </button>
        </div>

        <div role="tabpanel">
          {activeTab === "upcoming" ? (
            <SectionPanel
              emptyDescription={copy.upcomingEmptyDescription}
              emptyTitle={copy.upcomingEmptyTitle}
              events={sections.upcoming}
              showExploreLink
              testId="my-events-upcoming"
            />
          ) : (
            <SectionPanel
              emptyDescription={copy.pastEmptyDescription}
              emptyTitle={copy.pastEmptyTitle}
              events={sections.past}
              testId="my-events-past"
            />
          )}
        </div>
      </div>
    </AppShell>
  )
}
