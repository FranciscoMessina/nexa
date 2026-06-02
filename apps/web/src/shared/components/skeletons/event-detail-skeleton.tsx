import { Skeleton } from "@workspace/ui/components/skeleton"

export function EventDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6" data-testid="event-detail-skeleton">
      <Skeleton className="h-5 w-40" />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[2rem] border border-[#e8edf5] bg-white">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="space-y-4 p-4 sm:p-5">
              <Skeleton className="h-2.5 w-24" />
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton className="aspect-4/3 w-full rounded-2xl" key={index} />
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6 rounded-[2rem] border border-[#e8edf5] bg-white p-6 sm:p-8">
            <Skeleton className="h-7 w-36 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-4/5" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl sm:col-span-2" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[2rem] border border-[#e8edf5] bg-white p-6">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="mt-4 h-4 w-3/4" />
            <Skeleton className="mt-6 h-12 w-full rounded-xl" />
          </section>
          <section className="rounded-[2rem] border border-[#e8edf5] bg-white p-6">
            <Skeleton className="h-6 w-32" />
            <div className="mt-4 flex items-center gap-3">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
