import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query"
import type { UpdateProfileInput } from "@/features/profiles/api/profiles.server"
import { profilesService } from "@/features/profiles/services/profiles.service"
import type { Profile } from "@/features/profiles/types/profile.types"
import { useAuth } from "@/shared/hooks/useAuth"

export const profilesQueryKeys = {
  detail: (profileId: string) => ["profiles", profileId] as const,
  current: ["profiles", "current"] as const,
  list: (profileIds: Array<string>) => ["profiles", "list", ...profileIds] as const,
}

type ProfileQuerySnapshot = Pick<
  UseQueryResult<Profile | null>,
  "isFetched" | "isPending" | "fetchStatus"
>

export function isProfileQueryResolving(
  query: ProfileQuerySnapshot,
  enabled: boolean
): boolean {
  return (
    enabled &&
    (!query.isFetched || query.isPending || query.fetchStatus === "fetching")
  )
}

export function useProfileQuery(profileId: string | undefined) {
  const enabled = Boolean(profileId)

  const query = useQuery({
    queryKey: profilesQueryKeys.detail(profileId ?? ""),
    queryFn: () => profilesService.fetchProfileById(profileId!),
    enabled,
  })

  return {
    ...query,
    isResolving: isProfileQueryResolving(query, enabled),
    isResolved: enabled && query.isFetched,
  }
}

export function useCurrentProfileQuery(enabled = true) {
  const query = useQuery({
    queryKey: profilesQueryKeys.current,
    queryFn: () => profilesService.fetchCurrentProfile(),
    enabled,
  })

  return {
    ...query,
    isResolving: isProfileQueryResolving(query, enabled),
    isResolved: enabled && query.isFetched,
  }
}

export function useOwnProfile() {
  const { isHydrated, isAuthenticated } = useAuth()
  const enabled = isHydrated && isAuthenticated
  const query = useCurrentProfileQuery(enabled)

  return {
    ...query,
    profile: query.data,
  }
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

export function useRequestProfileValidationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => profilesService.requestProfileValidation(),
    onSuccess: ({ profile }) => {
      queryClient.setQueryData(profilesQueryKeys.detail(profile.id), profile)
      queryClient.setQueryData(profilesQueryKeys.current, profile)
      void queryClient.invalidateQueries({ queryKey: ["profiles"] })
      void queryClient.invalidateQueries({ queryKey: ["events"] })
    },
  })
}

export function useProfilesByIdsQuery(profileIds: Array<string>) {
  const sortedIds = [...profileIds].sort()
  const enabled = profileIds.length > 0

  const query = useQuery({
    queryKey: ["profiles", "list", sortedIds.join(",")],
    queryFn: () => profilesService.fetchProfilesByIds(profileIds),
    enabled,
  })

  return {
    ...query,
    isResolving: isProfileQueryResolving(query, enabled),
  }
}
