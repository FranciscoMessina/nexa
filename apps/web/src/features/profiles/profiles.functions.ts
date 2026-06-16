import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { updateProfileInputSchema } from "./validation/profile.schema"

export const getProfileByIdFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ profileId: z.string().min(1) }).parse(data)
  )
  .handler(async ({ data }) => {
    const { getPublicProfileById } = await import("./api/profiles.server")
    const profile = await getPublicProfileById(data.profileId)
    return { profile }
  })

export const getCurrentProfileFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getCurrentProfile } = await import("./api/profiles.server")
  const profile = await getCurrentProfile()
  return { profile }
})

export const getProfilesByIdsFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ profileIds: z.array(z.string().min(1)) }).parse(data)
  )
  .handler(async ({ data }) => {
    const { getPublicProfilesByIds } = await import("./api/profiles.server")
    const profiles = await getPublicProfilesByIds(data.profileIds)
    return { profiles }
  })

export const updateProfileFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => updateProfileInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { updateProfile } = await import("./api/profiles.server")
    const profile = await updateProfile(data)
    return { profile }
  })

export const requestProfileValidationFn = createServerFn({ method: "POST" }).handler(async () => {
  const { requestProfileValidation } = await import("./api/profiles.server")
  return requestProfileValidation()
})
