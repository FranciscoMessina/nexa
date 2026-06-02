import { useMemo } from "react"
import {
  IconMapPin,
  IconRefresh,
  IconTag,
  IconUsers,
} from "@tabler/icons-react"
import type { EventFilterOption } from "@/features/events/types/event.types"
import { EventDatePicker } from "@/features/events/components/event-date-picker"
import { eventFilterCategoryOptions } from "@/features/events/data/event-categories"
import { useEventFilters } from "@/features/events/hooks/use-event-filters"
import { useEventsQuery } from "@/features/events/hooks/events-queries"
import { sortFilterOptionsAlphabetically } from "@/features/events/utils/sort-filter-options.utils"

const neighborhoodOptions = sortFilterOptionsAlphabetically([
  { value: "all", label: "Todos" },
  { value: "Palermo", label: "Palermo" },
  { value: "Colegiales", label: "Colegiales" },
  { value: "Villa Crespo", label: "Villa Crespo" },
  { value: "Chacarita", label: "Chacarita" },
  { value: "Recoleta", label: "Recoleta" },
  { value: "San Telmo", label: "San Telmo" },
  { value: "Puerto Madero", label: "Puerto Madero" },
  { value: "Microcentro", label: "Microcentro" },
])

const eventTypeOptions = sortFilterOptionsAlphabetically([
  { value: "all", label: "Todos" },
  { value: "verified", label: "Verificados" },
  { value: "community", label: "Comunitarios" },
])

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function getEventDateBounds(events: Array<{ date: Date }>): { min: string; max: string } {
  const dateKeys = events.map((event) => toDateKey(event.date)).sort()

  return {
    min: dateKeys[0] ?? "",
    max: dateKeys.at(-1) ?? "",
  }
}

type FilterSelectProps = {
  label: string
  icon: typeof IconMapPin
  value: string
  options: Array<EventFilterOption>
  testId: string
  onChange: (value: string) => void
}

function FilterSelect({
  label,
  icon: Icon,
  value,
  options,
  testId,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-xs font-semibold text-[#6b7d9c]">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-[#dfe6f3] bg-white px-3 py-2">
        <Icon className="shrink-0 text-[#8a9bb8]" size={18} stroke={1.8} />
        <select
          className="w-full min-w-0 cursor-pointer border-none bg-transparent text-sm font-medium text-[#1a3462] outline-none"
          data-testid={testId}
          onChange={(event) => {
            onChange(event.target.value)
          }}
          value={value}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  )
}

export function EventFilters() {
  const {
    neighborhood,
    category,
    date,
    eventType,
    setNeighborhood,
    setCategory,
    setDate,
    setEventType,
    reset,
  } = useEventFilters()

  const { data: events = [] } = useEventsQuery()
  const { min, max } = useMemo(() => getEventDateBounds(events), [events])

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border border-[#e8edf5] bg-[#f9fafc] p-4 lg:flex-row lg:items-end lg:gap-4"
      data-testid="event-filters"
    >
      <FilterSelect
        icon={IconMapPin}
        label="Barrio"
        onChange={setNeighborhood}
        options={neighborhoodOptions}
        testId="filter-neighborhood"
        value={neighborhood}
      />
      <FilterSelect
        icon={IconTag}
        label="Categoría"
        onChange={setCategory}
        options={eventFilterCategoryOptions}
        testId="filter-category"
        value={category}
      />
      <EventDatePicker
        label="Fecha"
        max={max}
        min={min}
        onChange={setDate}
        testId="filter-date"
        emptyValue="all"
        value={date}
      />
      <FilterSelect
        icon={IconUsers}
        label="Tipo de evento"
        onChange={setEventType}
        options={eventTypeOptions}
        testId="filter-event-type"
        value={eventType}
      />

      <button
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#dfe6f3] bg-white px-4 py-2.5 text-sm font-semibold text-[#1a3462] transition hover:bg-[#eef3fb] lg:mb-0.5"
        data-testid="filter-reset-button"
        onClick={reset}
        type="button"
      >
        <IconRefresh size={18} stroke={1.8} />
        Limpiar filtros
      </button>
    </div>
  )
}
