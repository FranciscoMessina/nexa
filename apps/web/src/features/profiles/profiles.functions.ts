import { createServerFn } from "@tanstack/react-start"

export const getProfileByIdFn = createServerFn({ method: "POST" })
  .inputValidator((data: { profileId: string }) => data)
  .handler(async ({ data }) => {
    const { getProfileById } = await import("./api/profiles.server")
    const profile = await getProfileById(data.profileId)
    return { profile }
  })

export const getCurrentProfileFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getCurrentProfile } = await import("./api/profiles.server")
  const profile = await getCurrentProfile()
  return { profile }
})

export const getProfilesByIdsFn = createServerFn({ method: "POST" })
  .inputValidator((data: { profileIds: Array<string> }) => data)
  .handler(async ({ data }) => {
    const { getProfilesByIds } = await import("./api/profiles.server")
    const profiles = await getProfilesByIds(data.profileIds)
    return { profiles }
  })

export const updateProfileFn = createServerFn({ method: "POST" })
  .inputValidator((data: import("./api/profiles.server").UpdateProfileInput) => data)
  .handler(async ({ data }) => {
    const { updateProfile } = await import("./api/profiles.server")
    const profile = await updateProfile(data)
    return { profile }
  })

export const requestProfileValidationFn = createServerFn({ method: "POST" }).handler(async () => {
  const { requestProfileValidation } = await import("./api/profiles.server")
  return requestProfileValidation()
})
