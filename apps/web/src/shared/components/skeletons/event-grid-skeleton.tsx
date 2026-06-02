import { Skeleton } from "@workspace/ui/components/skeleton"

export function EventCardSkeleton() {
  return (
    <article
      className="flex flex-col overflow-hidden rounded-2xl border border-[#e8edf5] bg-white shadow-[0_8px_30px_-20px_rgba(15,40,90,0.35)]"
      data-testid="event-card-skeleton"
    >
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="mt-auto h-10 w-full rounded-xl" />
      </div>
    </article>
  )
}

type EventGridSkeletonProps = {
  count?: number
}

export function EventGridSkeleton({ count = 6 }: EventGridSkeletonProps) {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      data-testid="event-grid-skeleton"
    >
      {Array.from({ length: count }, (_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  )
}
