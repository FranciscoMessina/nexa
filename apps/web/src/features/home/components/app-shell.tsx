import type { ReactNode } from "react"
import { AppHeader } from "@/features/home/components/app-header"
import { AppSidebar } from "@/features/home/components/app-sidebar"

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-svh bg-[#f4f6fa]" data-testid="app-shell">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
