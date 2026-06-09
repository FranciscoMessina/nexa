import { Skeleton } from "@workspace/ui/components/skeleton"
import { EventRecommendationNotice } from "@/features/events/components/event-recommendation-notice"
import { useEventRecommendationQuery } from "@/features/events/hooks/events-queries"

type EventRecommendationBannerProps = {
  enabled?: boolean
}

export function EventRecommendationBanner({ enabled = true }: EventRecommendationBannerProps) {
  const { data: recommendation, isPending } = useEventRecommendationQuery(enabled)

  if (isPending) {
    return (
      <div className="space-y-3" data-testid="event-recommendation-skeleton">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-36 w-full rounded-2xl" />
      </div>
    )
  }

  if (!recommendation) {
    return null
  }

  return <EventRecommendationNotice recommendation={recommendation} />
}
