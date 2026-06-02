import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { UpdateProfileInput } from "@/features/profiles/api/profiles.server"
import { profilesService } from "@/features/profiles/services/profiles.service"

export const profilesQueryKeys = {
  detail: (profileId: string) => ["profiles", profileId] as const,
  current: ["profiles", "current"] as const,
  list: (profileIds: Array<string>) => ["profiles", "list", ...profileIds] as const,
}

export function useProfileQuery(profileId: string | undefined) {
  return useQuery({
    queryKey: profilesQueryKeys.detail(profileId ?? ""),
    queryFn: () => profilesService.fetchProfileById(profileId!),
    enabled: Boolean(profileId),
  })
}

export function useCurrentProfileQuery(enabled = true) {
  return useQuery({
    queryKey: profilesQueryKeys.current,
    queryFn: () => profilesService.fetchCurrentProfile(),
    enabled,
  })
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => profilesService.updateProfile(input),
    onSuccess: (profile) => {
      queryClient.setQueryData(profilesQueryKeys.detail(profile.id), profile)
      queryClient.setQueryData(profilesQueryKeys.current, profile)
      void queryClient.invalidateQueries({ queryKey: ["profiles"] })
    },
  })
}

export function useProfilesByIdsQuery(profileIds: Array<string>) {
  const sortedIds = [...profileIds].sort()

  return useQuery({
    queryKey: ["profiles", "list", sortedIds.join(",")],
    queryFn: () => profilesService.fetchProfilesByIds(profileIds),
    enabled: profileIds.length > 0,
  })
}
