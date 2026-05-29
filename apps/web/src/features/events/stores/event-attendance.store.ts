import { create } from "zustand"

const STORAGE_KEY = "nexa-event-attendance"

type AttendanceByProfile = Record<string, Array<string>>

type EventAttendanceState = {
  byProfileId: AttendanceByProfile
  isHydrated: boolean
  hydrate: () => void
  setAttending: (profileId: string, eventId: string, attending: boolean) => void
  isAttending: (profileId: string, eventId: string) => boolean
  getAttendingEventIds: (profileId: string) => Array<string>
  getAttendanceCount: (eventId: string, seedAttendeeProfileIds?: Array<string>) => number
  clearAttendanceForEvent: (eventId: string) => void
}

function readStoredAttendance(): AttendanceByProfile {
  if (typeof window === "undefined") {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw) as AttendanceByProfile

    if (!parsed || typeof parsed !== "object") {
      return {}
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, eventIds]) => Array.isArray(eventIds) && eventIds.every((id) => typeof id === "string")
      )
    )
  } catch {
    return {}
  }
}

function writeStoredAttendance(byProfileId: AttendanceByProfile): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(byProfileId))
}

export const useEventAttendanceStore = create<EventAttendanceState>()((set, get) => ({
  byProfileId: {},
  isHydrated: false,
  hydrate: () => {
    set({ byProfileId: readStoredAttendance(), isHydrated: true })
  },
  setAttending: (profileId, eventId, attending) => {
    const current = get().byProfileId[profileId] ?? []
    const nextIds = attending
      ? current.includes(eventId)
        ? current
        : [...current, eventId]
      : current.filter((id) => id !== eventId)

    const nextByProfile = {
      ...get().byProfileId,
      [profileId]: nextIds,
    }

    writeStoredAttendance(nextByProfile)
    set({ byProfileId: nextByProfile })
  },
  isAttending: (profileId, eventId) => {
    return (get().byProfileId[profileId] ?? []).includes(eventId)
  },
  getAttendingEventIds: (profileId) => {
    return get().byProfileId[profileId] ?? []
  },
  getAttendanceCount: (eventId, seedAttendeeProfileIds = []) => {
    const counted = new Set<string>()

    for (const [profileId, eventIds] of Object.entries(get().byProfileId)) {
      if (eventIds.includes(eventId)) {
        counted.add(profileId)
      }
    }

    for (const profileId of seedAttendeeProfileIds) {
      counted.add(profileId)
    }

    return counted.size
  },
  clearAttendanceForEvent: (eventId) => {
    const nextByProfile = Object.fromEntries(
      Object.entries(get().byProfileId).map(([profileId, eventIds]) => [
        profileId,
        eventIds.filter((id) => id !== eventId),
      ])
    )

    writeStoredAttendance(nextByProfile)
    set({ byProfileId: nextByProfile })
  },
}))
