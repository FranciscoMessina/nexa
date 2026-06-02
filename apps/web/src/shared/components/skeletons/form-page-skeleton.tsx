import { Skeleton } from "@workspace/ui/components/skeleton"

export function FormPageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6" data-testid="form-page-skeleton">
      <div className="space-y-2">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      <section className="space-y-5 rounded-[2rem] border border-[#e8edf5] bg-white p-6">
        {Array.from({ length: 8 }, (_, index) => (
          <div className="space-y-2" key={index}>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-11 w-40 rounded-xl" />
      </section>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" data-testid="dashboard-skeleton">
      <div className="rounded-[2rem] border border-white/70 bg-white/90 px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-9 w-72 max-w-full" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>
      <Skeleton className="h-16 w-full rounded-2xl" />
      <Skeleton className="h-5 w-32" />
    </div>
  )
}
