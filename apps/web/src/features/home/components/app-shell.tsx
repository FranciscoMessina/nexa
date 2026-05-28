import type { ReactNode } from "react"
import { AppSidebar } from "@/features/home/components/app-sidebar"

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-svh bg-[#faf7f2]" data-testid="app-shell">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
