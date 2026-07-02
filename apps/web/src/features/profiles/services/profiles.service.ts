import {
  getCurrentProfileFn,
  getProfileByIdFn,
  getProfilesByIdsFn,
  listEntrepreneurProfilesFn,
  updateProfileFn,
} from "../profiles.functions"
import type { UpdateProfileInput } from "../api/profiles.server"
import type { Profile } from "../types/profile.types"

export async function fetchProfileById(profileId: string): Promise<Profile | null> {
  const { profile } = await getProfileByIdFn({ data: { profileId } })
  return profile
}

export async function fetchCurrentProfile(): Promise<Profile | null> {
  const { profile } = await getCurrentProfileFn()
  return profile
}

export async function fetchProfilesByIds(profileIds: Array<string>): Promise<Array<Profile>> {
  const { profiles } = await getProfilesByIdsFn({ data: { profileIds } })
  return profiles
}

export async function fetchEntrepreneurProfiles(): Promise<Array<Profile>> {
  const { profiles } = await listEntrepreneurProfilesFn()
  return profiles
}

export async function updateProfile(input: UpdateProfileInput): Promise<Profile> {
  const { profile } = await updateProfileFn({ data: input })
  return profile
}

export const profilesService = {
  fetchProfileById,
  fetchCurrentProfile,
  fetchProfilesByIds,
  fetchEntrepreneurProfiles,
  updateProfile,
}

export default profilesService
