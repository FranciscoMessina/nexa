import type { UserRole } from "@/features/auth/types/auth.types"

export type MyEventsCopy = {
  subtitle: string
  upcomingTitle: string
  pastTitle: string
  upcomingEmptyTitle: string
  upcomingEmptyDescription: string
  pastEmptyTitle: string
  pastEmptyDescription: string
}

export function getMyEventsCopy(role: UserRole): MyEventsCopy {
  if (role === "organizador") {
    return {
      subtitle: "Eventos que creaste y a los que confirmaste asistencia",
      upcomingTitle: "Próximos",
      pastTitle: "Pasados",
      upcomingEmptyTitle: "No tenés eventos próximos",
      upcomingEmptyDescription:
        "Publicá uno desde Crear evento o explorá el muro y confirmá asistencia.",
      pastEmptyTitle: "No tenés historial de eventos pasados",
      pastEmptyDescription:
        "Cuando terminen los eventos a los que fuiste o los que organizaste, van a aparecer acá.",
    }
  }

  if (role === "emprendedor") {
    return {
      subtitle: "Eventos en los que participa tu emprendimiento",
      upcomingTitle: "Próximos",
      pastTitle: "Pasados",
      upcomingEmptyTitle: "No tenés eventos próximos",
      upcomingEmptyDescription:
        "Explorá eventos en el muro y tocá «Solicitar participar» para sumarte con tu emprendimiento.",
      pastEmptyTitle: "No tenés historial de eventos pasados",
      pastEmptyDescription:
        "Los eventos en los que participó tu emprendimiento y ya finalizaron se listan acá.",
    }
  }

  return {
    subtitle: "Eventos a los que confirmaste que vas a asistir",
    upcomingTitle: "Próximos",
    pastTitle: "Pasados",
    upcomingEmptyTitle: "No tenés eventos próximos",
    upcomingEmptyDescription:
      "Explorá el muro y tocá «Asistir al evento» en los que te interesen.",
    pastEmptyTitle: "No tenés historial de eventos pasados",
    pastEmptyDescription:
      "Los eventos a los que confirmaste asistencia y ya pasaron van a quedar guardados acá.",
  }
}
