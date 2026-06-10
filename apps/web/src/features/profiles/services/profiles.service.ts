import {
  getCurrentProfileFn,
  getProfileByIdFn,
  getProfilesByIdsFn,
  requestProfileValidationFn,
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

export async function updateProfile(input: UpdateProfileInput): Promise<Profile> {
  const { profile } = await updateProfileFn({ data: input })
  return profile
}

export async function requestProfileValidation(): Promise<
  import("../api/profiles.server").RequestProfileValidationResult
> {
  return requestProfileValidationFn()
}

export const profilesService = {
  fetchProfileById,
  fetchCurrentProfile,
  fetchProfilesByIds,
  updateProfile,
  requestProfileValidation,
}

export default profilesService
