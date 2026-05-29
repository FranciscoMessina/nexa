import type { EventFilterOption } from "@/features/events/types/event.types"

/** Mantiene la opción "all" arriba y ordena el resto por etiqueta (A → Z). */
export function sortFilterOptionsAlphabetically(
  options: Array<EventFilterOption>,
  allValue = "all"
): Array<EventFilterOption> {
  const allOption = options.find((option) => option.value === allValue)
  const rest = options
    .filter((option) => option.value !== allValue)
    .sort((a, b) => a.label.localeCompare(b.label, "es", { sensitivity: "base" }))

  return allOption ? [allOption, ...rest] : rest
}
