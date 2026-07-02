import { IconSearch, IconX } from "@tabler/icons-react"
import { useMemo, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { useEntrepreneurProfilesQuery } from "@/features/profiles/hooks/profiles-queries"
import type { Profile } from "@/features/profiles/types/profile.types"

type EventEntrepreneurPickerProps = {
  selectedIds: Array<string>
  onChange: (selectedIds: Array<string>) => void
}

function filterProfiles(profiles: Array<Profile>, query: string): Array<Profile> {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return profiles
  }

  return profiles.filter((profile) => {
    const haystack = [
      profile.displayName,
      profile.headline,
      profile.location,
      profile.categoryLabel,
      profile.email,
    ]
      .join(" ")
      .toLowerCase()

    return haystack.includes(normalized)
  })
}

export function EventEntrepreneurPicker({
  selectedIds,
  onChange,
}: EventEntrepreneurPickerProps) {
  const [query, setQuery] = useState("")
  const { data: profiles = [], isLoading, isError } = useEntrepreneurProfilesQuery()

  const filteredProfiles = useMemo(
    () => filterProfiles(profiles, query),
    [profiles, query]
  )

  const selectedProfiles = useMemo(
    () => profiles.filter((profile) => selectedIds.includes(profile.id)),
    [profiles, selectedIds]
  )

  function toggleProfile(profileId: string): void {
    if (selectedIds.includes(profileId)) {
      onChange(selectedIds.filter((id) => id !== profileId))
      return
    }

    onChange([...selectedIds, profileId])
  }

  return (
    <div className="space-y-3 rounded-[1.25rem] border border-[#d5deed] bg-[#f8fbff] p-4">
      {selectedProfiles.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedProfiles.map((profile) => (
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#d5deed] bg-white px-3 py-1.5 text-xs font-semibold text-[#1a3462] transition hover:bg-[#f4f7fb]"
              key={profile.id}
              onClick={() => {
                toggleProfile(profile.id)
              }}
              type="button"
            >
              {profile.displayName}
              <IconX size={14} stroke={2} />
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#6b7d9c]">
          Opcional: elegí emprendimientos que ya estén en Nexa para mostrarlos en el evento.
        </p>
      )}

      <label className="relative block">
        <IconSearch
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#8a9bb8]"
          size={18}
          stroke={1.8}
        />
        <input
          className="w-full rounded-xl border border-[#d5deed] bg-white py-2.5 pr-4 pl-10 text-sm text-[#1a3462]"
          onChange={(event) => {
            setQuery(event.target.value)
          }}
          placeholder="Buscar emprendimiento por nombre, rubro o ubicación"
          value={query}
        />
      </label>

      <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border border-[#e8edf5] bg-white p-2">
        {isLoading ? (
          <p className="px-2 py-3 text-sm text-[#6b7d9c]">Cargando emprendimientos…</p>
        ) : isError ? (
          <p className="px-2 py-3 text-sm text-rose-600">
            No pudimos cargar los emprendimientos. Intentá de nuevo.
          </p>
        ) : filteredProfiles.length === 0 ? (
          <p className="px-2 py-3 text-sm text-[#6b7d9c]">No hay emprendimientos que coincidan.</p>
        ) : (
          filteredProfiles.map((profile) => {
            const isSelected = selectedIds.includes(profile.id)

            return (
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                  isSelected ? "bg-[#f0edff] ring-1 ring-[#6d5ae6]/30" : "hover:bg-[#f8fbff]"
                )}
                key={profile.id}
                onClick={() => {
                  toggleProfile(profile.id)
                }}
                type="button"
              >
                <img
                  alt={profile.displayName}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                  src={profile.avatarUrl || "/profiles/eventos/avatar.png"}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[#1a3462]">
                    {profile.displayName}
                  </span>
                  <span className="block truncate text-xs text-[#6b7d9c]">
                    {profile.categoryLabel}
                    {profile.location ? ` · ${profile.location}` : ""}
                  </span>
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-[11px] font-semibold",
                    isSelected
                      ? "bg-[#6d5ae6] text-white"
                      : "bg-[#eef2f8] text-[#6b7d9c]"
                  )}
                >
                  {isSelected ? "Agregado" : "Sumar"}
                </span>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
