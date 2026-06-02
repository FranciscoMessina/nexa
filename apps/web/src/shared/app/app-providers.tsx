import { QueryClientProvider } from "@tanstack/react-query"
import { useEffect } from "react"
import { queryClient } from "@/shared/lib/query-client"
import useAuthStore from "@/shared/store/useAuthStore"

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    void hydrate()
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
