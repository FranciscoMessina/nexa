import {
  IconCalendar,
  IconMapPin,
  IconRefresh,
  IconTag,
  IconUsers,
} from "@tabler/icons-react"
import type { EventFilterOption } from "@/features/events/types/event.types"
import { useEventFilters } from "@/features/events/hooks/use-event-filters"

const neighborhoodOptions: Array<EventFilterOption> = [
  { value: "all", label: "Todos" },
  { value: "Palermo", label: "Palermo" },
  { value: "Colegiales", label: "Colegiales" },
  { value: "Villa Crespo", label: "Villa Crespo" },
  { value: "Chacarita", label: "Chacarita" },
]

const categoryOptions: Array<EventFilterOption> = [
  { value: "all", label: "Todas" },
  { value: "Gastronomía y Bebidas", label: "Gastronomía y Bebidas" },
  { value: "Música", label: "Música" },
  { value: "Cultura y Educación", label: "Cultura y Educación" },
  { value: "Arte y Cultura", label: "Arte y Cultura" },
]

const dateOptions: Array<EventFilterOption> = [
  { value: "all", label: "Todas" },
  { value: "jun-2025", label: "Junio 2025" },
  { value: "jul-2025", label: "Julio 2025" },
]

const eventTypeOptions: Array<EventFilterOption> = [
  { value: "all", label: "Todos" },
  { value: "verified", label: "Verificados" },
  { value: "community", label: "Comunitarios" },
]

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
        options={categoryOptions}
        testId="filter-category"
        value={category}
      />
      <FilterSelect
        icon={IconCalendar}
        label="Fecha"
        onChange={setDate}
        options={dateOptions}
        testId="filter-date"
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
