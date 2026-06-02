import { Skeleton } from "@workspace/ui/components/skeleton"

export function EventProfileCardSkeleton({ testId = "event-profile-card-skeleton" }: { testId?: string }) {
  return (
    <div
      className="flex flex-col gap-4 rounded-[1.75rem] border border-[#e8edf5] bg-[#fbfcff] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
      data-testid={testId}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56 max-w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-xl sm:w-28" />
    </div>
  )
}
