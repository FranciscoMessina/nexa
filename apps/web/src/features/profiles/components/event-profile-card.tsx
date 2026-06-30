import { IconShieldCheck } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import type { Profile } from "@/features/profiles/types/profile.types"

type EventProfileCardProps = {
  profile: Profile
  subtitle?: string
  testId: string
}

export function EventProfileCard({ profile, subtitle, testId }: EventProfileCardProps) {
  const isVerifiedOrganizer =
    profile.kind === "organizador" && profile.validationStatus === "validated"

  return (
    <div
      className="flex flex-col gap-4 rounded-[1.75rem] border border-[#e8edf5] bg-[#fbfcff] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
      data-testid={testId}
    >
      <div className="flex items-center gap-4">
        <img
          alt={profile.displayName}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm"
          src={profile.avatarUrl}
        />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-[#1e1b4b]">{profile.displayName}</h3>
            {isVerifiedOrganizer ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <IconShieldCheck size={13} stroke={2} />
                Organizador verificado
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-sm text-[#6b7d9c]">
            {subtitle ?? `${profile.categoryLabel} · ${profile.location}`}
          </p>
        </div>
      </div>

      <Link
        className="inline-flex items-center justify-center rounded-xl border border-[#d6def0] px-4 py-2.5 text-sm font-semibold text-[#1e1b4b] transition hover:border-[#c4cee4] hover:bg-white"
        params={{ profileId: profile.id }}
        to="/perfiles/$profileId"
      >
        Ver perfil
      </Link>
    </div>
  )
}
