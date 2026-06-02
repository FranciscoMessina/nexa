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
      subtitle: "Eventos de tu emprendimiento, los que creaste y a los que vas a asistir",
      upcomingTitle: "Próximos",
      pastTitle: "Pasados",
      upcomingEmptyTitle: "No tenés eventos próximos",
      upcomingEmptyDescription:
        "Creá un evento, sumate a uno del muro o esperá invitaciones de tu emprendimiento.",
      pastEmptyTitle: "No tenés historial de eventos pasados",
      pastEmptyDescription:
        "Los eventos en los que participaste o a los que asististe ya finalizados se listan acá.",
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
