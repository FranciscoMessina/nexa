import { createFileRoute } from "@tanstack/react-router"
import { ProfilePage } from "@/features/profiles"

export const Route = createFileRoute("/perfil/")({
  component: PerfilRoute,
})

function PerfilRoute() {
  return <ProfilePage />
}
