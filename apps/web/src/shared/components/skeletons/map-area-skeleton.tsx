import { Skeleton } from "@workspace/ui/components/skeleton"

export function MapAreaSkeleton() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#f4f7fb]"
      data-testid="map-area-skeleton"
    >
      <Skeleton className="absolute inset-0 rounded-none opacity-60" />
      <div className="relative grid w-full max-w-md grid-cols-3 gap-6 px-8">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton className="mx-auto h-10 w-10 rounded-full" key={index} />
        ))}
      </div>
    </div>
  )
}
