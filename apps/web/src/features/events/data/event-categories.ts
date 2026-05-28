import type { EventFilterOption } from "@/features/events/types/event.types"

export const eventCategoryOptions: Array<EventFilterOption> = [
  { value: "Música", label: "Música" },
  { value: "Gastronomía", label: "Gastronomía" },
  { value: "Arte y Cultura", label: "Arte y Cultura" },
  { value: "Deportes", label: "Deportes" },
  { value: "Ferias de Emprendedores", label: "Ferias de Emprendedores" },
  { value: "Talleres y Cursos", label: "Talleres y Cursos" },
  { value: "Cine y Entretenimiento", label: "Cine y Entretenimiento" },
]

export const eventFilterCategoryOptions: Array<EventFilterOption> = [
  { value: "all", label: "Todas" },
  ...eventCategoryOptions,
]
