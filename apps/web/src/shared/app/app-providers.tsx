import { QueryClientProvider } from "@tanstack/react-query"
import { useEffect } from "react"
import { profilesQueryKeys } from "@/features/profiles/hooks/profiles-queries"
import { profilesService } from "@/features/profiles/services/profiles.service"
import { queryClient } from "@/shared/lib/query-client"
import useAuthStore from "@/shared/store/useAuthStore"

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    void hydrate().then(() => {
      const { isAuthenticated } = useAuthStore.getState()
      if (!isAuthenticated) {
        return
      }

      void queryClient.prefetchQuery({
        queryKey: profilesQueryKeys.current,
        queryFn: () => profilesService.fetchCurrentProfile(),
      })
    })
  }, [hydrate])

  return children
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </QueryClientProvider>
  )
}
