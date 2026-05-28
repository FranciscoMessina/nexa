import { create } from "zustand"
import { mockProfileRecords } from "@/features/profiles/data/mock-profile-records"
import type { Profile } from "@/features/profiles/types/profile.types"

const STORAGE_KEY = "nexa-profiles"

function buildInitialProfiles(): Record<string, Profile> {
  return Object.fromEntries(mockProfileRecords.map((profile) => [profile.id, profile]))
}

function readStoredProfiles(): Record<string, Profile> {
  if (typeof window === "undefined") {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object") {
      return {}
    }

    return parsed as Record<string, Profile>
  } catch {
    return {}
  }
}

function persistProfiles(profiles: Record<string, Profile>): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
  } catch {
    // ignore storage errors
  }
}

function normalizeProfileForSave(profile: Profile): Profile {
  if (profile.kind === "usuario") {
    const firstName = profile.firstName?.trim() ?? ""
    const lastName = profile.lastName?.trim() ?? ""
    const displayName = `${firstName} ${lastName}`.trim() || profile.displayName

    return {
      ...profile,
      firstName,
      lastName,
      displayName,
      headline: profile.description.trim() || profile.headline,
      city: profile.city?.trim() || profile.location,
    }
  }

  return {
    ...profile,
    displayName: profile.displayName.trim(),
    headline: profile.headline.trim() || profile.description.trim(),
    location: profile.location.trim(),
    categoryLabel: profile.categoryLabel.trim(),
    description: profile.description.trim(),
  }
}

type ProfileStoreState = {
  profiles: Record<string, Profile>
  isHydrated: boolean
  hydrate: () => void
  saveProfile: (profile: Profile) => void
  getProfileById: (profileId: string) => Profile | undefined
}

export const useProfileStore = create<ProfileStoreState>()((set, get) => ({
  profiles: buildInitialProfiles(),
  isHydrated: typeof window === "undefined",

  hydrate: () => {
    if (get().isHydrated) {
      return
    }

    const baseProfiles = buildInitialProfiles()
    const storedProfiles = readStoredProfiles()

    const profiles = Object.fromEntries(
      Object.entries(baseProfiles).map(([profileId, baseProfile]) => {
        const storedProfile = storedProfiles[profileId]
        if (!storedProfile) {
          return [profileId, baseProfile]
        }

        return [
          profileId,
          {
            ...storedProfile,
            avatarUrl: baseProfile.avatarUrl,
            representativeImageUrl: baseProfile.representativeImageUrl,
          },
        ]
      })
    )

    set({
      profiles,
      isHydrated: true,
    })
  },

  saveProfile: (profile) => {
    const normalizedProfile = normalizeProfileForSave(profile)

    set((state) => {
      const nextProfiles = {
        ...state.profiles,
        [normalizedProfile.id]: normalizedProfile,
      }

      persistProfiles(nextProfiles)

      return { profiles: nextProfiles }
    })
  },

  getProfileById: (profileId) => {
    return get().profiles[profileId]
  },
}))

export function getProfileById(profileId: string): Profile | undefined {
  const state = useProfileStore.getState()

  if (typeof window !== "undefined" && !state.isHydrated) {
    state.hydrate()
  }

  return state.profiles[profileId]
}
