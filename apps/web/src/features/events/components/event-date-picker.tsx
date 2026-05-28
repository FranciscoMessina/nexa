import { IconCalendar } from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"

type EventDatePickerProps = {
  label: string
  value: string
  testId: string
  onChange: (value: string) => void
  min?: string
  max?: string
  emptyValue?: string
  placeholder?: string
  error?: string
}

export function EventDatePicker({
  label,
  value,
  testId,
  onChange,
  min,
  max,
  emptyValue = "",
  placeholder = "dd/mm/aaaa",
  error,
}: EventDatePickerProps) {
  const hasDate = value !== emptyValue

  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-xs font-semibold text-[#6b7d9c]">{label}</span>
      <div className="relative flex items-center gap-2 rounded-xl border border-[#dfe6f3] bg-white px-3 py-2">
        <IconCalendar className="shrink-0 text-[#8a9bb8]" size={18} stroke={1.8} />
        <input
          className={cn(
            "relative z-10 w-full min-w-0 cursor-pointer border-none bg-transparent text-sm font-medium text-[#1a3462] outline-none",
            "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
            !hasDate && "text-transparent"
          )}
          data-testid={testId}
          lang="es-AR"
          max={max}
          min={min}
          onChange={(event) => {
            onChange(event.target.value || emptyValue)
          }}
          placeholder={placeholder}
          type="date"
          value={hasDate ? value : ""}
        />
        {!hasDate ? (
          <span
            aria-hidden
            className="pointer-events-none absolute left-10 z-0 text-sm text-[#9aa8c0]"
          >
            {placeholder}
          </span>
        ) : null}
      </div>
      {error ? <span className="text-xs font-normal text-rose-600">{error}</span> : null}
    </label>
  )
}