import { create } from "zustand"

type EventFiltersState = {
  neighborhood: string
  category: string
  date: string
  eventType: string
}

type EventFiltersActions = {
  setNeighborhood: (neighborhood: string) => void
  setCategory: (category: string) => void
  setDate: (date: string) => void
  setEventType: (eventType: string) => void
  reset: () => void
}

const initialState: EventFiltersState = {
  neighborhood: "all",
  category: "all",
  date: "all",
  eventType: "all",
}

export const useEventFiltersStore = create<EventFiltersState & EventFiltersActions>()(
  (set) => ({
    ...initialState,
    setNeighborhood: (neighborhood) => set({ neighborhood }),
    setCategory: (category) => set({ category }),
    setDate: (date) => set({ date }),
    setEventType: (eventType) => set({ eventType }),
    reset: () => set(initialState),
  })
)
