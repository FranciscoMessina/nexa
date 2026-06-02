import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query"
import { eventsService } from "@/features/events/services/events.service"
import { getAttendanceStateFn, toggleAttendanceFn } from "@/features/events/attendance.functions"
import type { CreateEventInput } from "@/features/events/types/event-create-input"

type AttendanceQuerySnapshot = Pick<
  UseQueryResult<Awaited<ReturnType<typeof getAttendanceStateFn>>>,
  "isFetched" | "isPending" | "fetchStatus"
>

function isAttendanceQueryResolving(query: AttendanceQuerySnapshot, enabled: boolean): boolean {
  return enabled && (!query.isFetched || query.isPending || query.fetchStatus === "fetching")
}

export const eventsQueryKeys = {
  all: ["events"] as const,
  detail: (eventId: string) => ["events", eventId] as const,
  myEvents: ["events", "mine"] as const,
  attendance: (eventId: string) => ["events", eventId, "attendance"] as const,
  attendingIds: ["events", "attending-ids"] as const,
}

export function useEventsQuery() {
  return useQuery({
    queryKey: eventsQueryKeys.all,
    queryFn: () => eventsService.fetchEvents(),
  })
}

export function useEventQuery(eventId: string) {
  return useQuery({
    queryKey: eventsQueryKeys.detail(eventId),
    queryFn: () => eventsService.fetchEventById(eventId),
    enabled: Boolean(eventId),
  })
}

export function useMyEventsSectionsQuery(enabled = true) {
  return useQuery({
    queryKey: eventsQueryKeys.myEvents,
    queryFn: () => eventsService.fetchMyEventsSections(),
    enabled,
  })
}

export function useAttendanceStateQuery(eventId: string) {
  const enabled = Boolean(eventId)

  const query = useQuery({
    queryKey: eventsQueryKeys.attendance(eventId),
    queryFn: () => getAttendanceStateFn({ data: { eventId } }),
    enabled,
  })

  return {
    ...query,
    isResolving: isAttendanceQueryResolving(query, enabled),
  }
}

export function useToggleAttendanceMutation(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => toggleAttendanceFn({ data: { eventId } }),
    onSuccess: (state) => {
      queryClient.setQueryData(eventsQueryKeys.attendance(eventId), state)
      void queryClient.invalidateQueries({ queryKey: eventsQueryKeys.myEvents })
      void queryClient.invalidateQueries({ queryKey: eventsQueryKeys.attendingIds })
    },
  })
}

export function useCreateEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateEventInput) => eventsService.createEvent(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventsQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: eventsQueryKeys.myEvents })
    },
  })
}

export function useUpdateEventMutation(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateEventInput) => eventsService.updateEvent(eventId, input),
    onSuccess: (event) => {
      void queryClient.invalidateQueries({ queryKey: eventsQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: eventsQueryKeys.detail(eventId) })
      void queryClient.invalidateQueries({ queryKey: eventsQueryKeys.myEvents })
      if (event) {
        queryClient.setQueryData(eventsQueryKeys.detail(eventId), event)
      }
    },
  })
}

export function useDeleteEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId: string) => eventsService.deleteEvent(eventId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventsQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: eventsQueryKeys.myEvents })
    },
  })
}
