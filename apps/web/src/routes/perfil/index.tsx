import { createFileRoute } from "@tanstack/react-router"
import { ProfilePage } from "@/features/profiles"
import { requireAuthRoute } from "@/shared/lib/auth/require-auth.route"

export const Route = createFileRoute("/perfil/")({
  beforeLoad: () => requireAuthRoute(),
  component: PerfilRoute,
})

function PerfilRoute() {
  return <ProfilePage />
}
