import { Skeleton } from "@workspace/ui/components/skeleton"

type EventAttendanceSidebarSkeletonProps = {
  showAttendAction?: boolean
}

export function EventAttendanceSidebarSkeleton({
  showAttendAction = true,
}: EventAttendanceSidebarSkeletonProps) {
  return (
    <div className="space-y-4" data-testid="event-attendance-sidebar-skeleton">
      <div className="rounded-2xl bg-[#f9fbff] p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[18px] w-[18px] rounded-md" />
          <Skeleton className="h-4 w-4/5 max-w-[240px]" />
        </div>
      </div>

      {showAttendAction ? <Skeleton className="h-[50px] w-full rounded-2xl" /> : null}
    </div>
  )
}
