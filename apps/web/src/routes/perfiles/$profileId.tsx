import { createFileRoute } from "@tanstack/react-router"
import { ProfilePage } from "@/features/profiles"

export const Route = createFileRoute("/perfiles/$profileId")({
  component: PerfilPublicoRoute,
})

function PerfilPublicoRoute() {
  const { profileId } = Route.useParams()

  return <ProfilePage profileId={profileId} />
}
