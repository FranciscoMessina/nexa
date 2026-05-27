import { getProfileById as getStoredProfileById } from "@/features/profiles/stores/profile.store"
import { mockProfileRecords } from "@/features/profiles/data/mock-profile-records"
import type { Profile } from "@/features/profiles/types/profile.types"

export const mockProfiles = mockProfileRecords

const profileByEmail: Readonly<Record<string, string>> = {
  "asistente@nexa.mock": "profile-maria-lopez",
  "organizador@nexa.mock": "profile-antares-bar",
  "emprendedor@nexa.mock": "profile-crudo",
}

export function getMockProfileById(profileId: string): Profile | undefined {
  return getStoredProfileById(profileId) ?? mockProfileRecords.find((profile) => profile.id === profileId)
}

export function getMockProfileForEmail(email: string): Profile | undefined {
  const profileId = profileByEmail[email.trim().toLowerCase()]
  if (!profileId) {
    return undefined
  }

  return getMockProfileById(profileId)
}

export function getMockProfilesByIds(profileIds: Array<string>): Array<Profile> {
  return profileIds
    .map((profileId) => getMockProfileById(profileId))
    .filter((profile): profile is Profile => profile !== undefined)
}
