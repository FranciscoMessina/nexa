import { Skeleton } from "@workspace/ui/components/skeleton"

export function ProfilePageSkeleton() {
  return (
    <div className="space-y-6" data-testid="profile-page-skeleton">
      <div className="space-y-2">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>

      <section className="rounded-[2rem] border border-[#e8edf5] bg-white p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 max-w-full" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#e8edf5] bg-white p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }, (_, index) => (
            <div className="space-y-2" key={index}>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
