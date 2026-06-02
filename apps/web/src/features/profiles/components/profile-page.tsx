import {
  IconCalendar,
  IconCamera,
  IconMapPin,
  IconPencil,
  IconShieldCheck,
  IconTag,
} from "@tabler/icons-react"
import { useMemo, useRef, useState } from "react"
import { useImageUpload } from "@/features/storage"
import { cn } from "@workspace/ui/lib/utils"
import { useRequireAuthentication } from "@/features/auth"
import type { UserRole } from "@/features/auth/types/auth.types"
import { AppShell } from "@/features/home/components/app-shell"
import { ProfileFormFields } from "@/features/profiles/components/profile-form-fields"
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "@/features/profiles/hooks/profiles-queries"
import type { Profile, ProfileKind } from "@/features/profiles/types/profile.types"
import { useAuth } from "@/shared/hooks/useAuth"

type ProfilePageProps = {
  profileId?: string
}

function getPageTitle(kind: ProfileKind, isOwnProfile: boolean): string {
  if (!isOwnProfile) {
    return "Perfil"
  }

  if (kind === "usuario") {
    return "Mi perfil"
  }

  if (kind === "emprendimiento") {
    return "Perfil emprendimiento"
  }

  return "Perfil organizador"
}

function getPageSubtitle(kind: ProfileKind, isOwnProfile: boolean, isEditing: boolean): string {
  if (!isOwnProfile) {
    return "Información pública del perfil."
  }

  if (isEditing) {
    return "Modificá tus datos y guardá los cambios."
  }

  if (kind === "usuario") {
    return "Visualizá y editá tu información personal."
  }

  if (kind === "emprendimiento") {
    return "Gestioná la información de tu emprendimiento."
  }

  return "Gestioná la información de tu organizador y solicitá la validación de tu perfil."
}

function getAllowedRolesForProfile(kind: ProfileKind): Array<UserRole> {
  if (kind === "usuario") {
    return ["asistente"]
  }

  if (kind === "emprendimiento") {
    return ["emprendedor"]
  }

  return ["organizador"]
}

function StatusBadge({ profile }: { profile: Profile }) {
  if (profile.validationStatus === "not_validated") {
    return (
      <span className="inline-flex rounded-full bg-[#ffe8e8] px-3 py-1 text-xs font-semibold text-[#c24141]">
        No validado
      </span>
    )
  }

  if (!profile.statusBadge) {
    return null
  }

  const toneClass =
    profile.statusBadge.tone === "success"
      ? "bg-emerald-50 text-emerald-700"
      : profile.statusBadge.tone === "warning"
        ? "bg-amber-50 text-amber-700"
        : "bg-[#eef2f8] text-[#5a6f8f]"

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", toneClass)}>
      {profile.statusBadge.label}
    </span>
  )
}

export function ProfilePage({ profileId }: ProfilePageProps) {
  const { user } = useAuth()
  const ownProfileId = user?.id
  const resolvedProfileId = profileId ?? ownProfileId
  const { data: profile, isLoading: isProfileLoading } = useProfileQuery(resolvedProfileId)
  const updateProfileMutation = useUpdateProfileMutation()

  const isOwnProfile = Boolean(ownProfileId && resolvedProfileId === ownProfileId)
  const canEdit = isOwnProfile && !profileId

  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<Profile | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const { isUploading, error: imageUploadError, upload: uploadImage } = useImageUpload()

  const { isChecking, isAllowed } = useRequireAuthentication(
    profileId
      ? undefined
      : {
          allowedRoles: profile ? getAllowedRolesForProfile(profile.kind) : undefined,
        }
  )

  const displayProfile = useMemo(() => {
    if (isEditing && draft) {
      return draft
    }

    return profile
  }, [draft, isEditing, profile])

  if (isChecking || isProfileLoading) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#faf7f2] p-6">
        <p className="text-[#1a3462]">Cargando perfil...</p>
      </main>
    )
  }

  if (!isAllowed || !displayProfile) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-[#e8edf5] bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-[#0a2558]">Perfil no encontrado</h1>
          <p className="mt-2 text-[#6b7d9c]">No pudimos cargar la información de este perfil.</p>
        </div>
      </AppShell>
    )
  }

  function startEditing(): void {
    if (!profile) {
      return
    }

    setDraft(structuredClone(profile))
    setIsEditing(true)
    setSaveMessage(null)
  }

  function cancelEditing(): void {
    setDraft(null)
    setIsEditing(false)
    setSaveMessage(null)
  }

  async function handleSave(): Promise<void> {
    if (!draft) {
      return
    }

    await updateProfileMutation.mutateAsync({
      id: draft.id,
      displayName: draft.displayName,
      headline: draft.headline,
      location: draft.location,
      description: draft.description,
      avatarUrl: draft.avatarUrl,
      representativeImageUrl: draft.representativeImageUrl,
      email: draft.email,
      phone: draft.phone,
      birthDate: draft.birthDate,
      socialLinks: draft.socialLinks,
    })
    setDraft(null)
    setIsEditing(false)
    setSaveMessage("Cambios guardados correctamente.")
  }

  function updateDraft(updates: Partial<Profile>): void {
    setDraft((current) => (current ? { ...current, ...updates } : current))
  }

  function updateSocialLink(linkId: string, handle: string): void {
    setDraft((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        socialLinks: current.socialLinks.map((link) =>
          link.id === linkId ? { ...link, handle } : link
        ),
      }
    })
  }

  async function handleAvatarSelect(file: File): Promise<void> {
    if (!displayProfile) {
      return
    }

    const publicUrl = await uploadImage(file, "avatar", displayProfile.id)
    if (publicUrl) {
      updateDraft({ avatarUrl: publicUrl })
    }
  }

  async function handleRepresentativeSelect(file: File): Promise<void> {
    if (!displayProfile) {
      return
    }

    const publicUrl = await uploadImage(file, "representative", displayProfile.id)
    if (publicUrl) {
      updateDraft({ representativeImageUrl: publicUrl })
    }
  }

  return (
    <AppShell>
      <div className="space-y-6" data-testid="profile-page">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2558] lg:text-4xl">
            {getPageTitle(displayProfile.kind, isOwnProfile)}
          </h1>
          <p className="mt-2 text-base text-[#6b7d9c]">
            {getPageSubtitle(displayProfile.kind, isOwnProfile, isEditing)}
          </p>
        </div>

        {saveMessage ? (
          <p
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
            data-testid="profile-save-message"
          >
            {saveMessage}
          </p>
        ) : null}

        {isEditing ? (
          <p className="rounded-xl border border-[#e8e0ff] bg-[#f7f4ff] px-4 py-3 text-sm text-[#5b4bb7]">
            Estás editando tu perfil. Cuando termines, guardá los cambios.
          </p>
        ) : null}

        <section className="rounded-[2rem] border border-[#e8edf5] bg-linear-to-r from-[#f4f0ff] via-[#f8f9ff] to-white p-6 shadow-[0_18px_60px_-44px_rgba(91,75,183,0.35)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <input
                  accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) {
                      void handleAvatarSelect(file)
                    }
                    event.target.value = ""
                  }}
                  ref={avatarInputRef}
                  type="file"
                />
                <img
                  alt={displayProfile.displayName}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-md"
                  src={displayProfile.avatarUrl}
                />
                {canEdit && isEditing ? (
                  <button
                    aria-label="Cambiar foto de perfil"
                    className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#5b4bb7] shadow disabled:opacity-60"
                    disabled={isUploading}
                    onClick={() => {
                      avatarInputRef.current?.click()
                    }}
                    type="button"
                  >
                    <IconCamera size={16} stroke={1.8} />
                  </button>
                ) : null}
                {canEdit && isEditing && isUploading ? (
                  <p className="mt-1 text-xs text-[#6b7d9c]">Subiendo foto…</p>
                ) : null}
                {canEdit && isEditing && imageUploadError ? (
                  <p className="mt-1 text-xs text-rose-600">{imageUploadError}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#1e1b4b]">{displayProfile.displayName}</h2>
                <p className="max-w-2xl text-sm leading-6 text-[#51617d]">{displayProfile.headline}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#6b7d9c]">
                  <span className="inline-flex items-center gap-1.5">
                    <IconMapPin size={16} stroke={1.8} />
                    {displayProfile.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <IconTag size={16} stroke={1.8} />
                    {displayProfile.categoryLabel}
                  </span>
                  {displayProfile.memberSince ? (
                    <span className="inline-flex items-center gap-1.5">
                      <IconCalendar size={16} stroke={1.8} />
                      Miembro desde {displayProfile.memberSince}
                    </span>
                  ) : null}
                </div>
                <StatusBadge profile={displayProfile} />
              </div>
            </div>

            {canEdit && !isEditing ? (
              <div className="flex flex-wrap gap-3">
                {displayProfile.kind === "organizador" &&
                displayProfile.validationStatus === "not_validated" ? (
                  <button
                    className="inline-flex items-center gap-2 rounded-xl border border-[#d6def0] bg-white px-4 py-2.5 text-sm font-semibold text-[#1e1b4b]"
                    type="button"
                  >
                    <IconShieldCheck size={18} stroke={1.8} />
                    Solicitar validación
                  </button>
                ) : null}
                <button
                  className="inline-flex items-center gap-2 rounded-xl border border-[#d6def0] bg-white px-4 py-2.5 text-sm font-semibold text-[#1e1b4b] transition hover:bg-[#f7f9ff]"
                  data-testid="profile-edit-button"
                  onClick={startEditing}
                  type="button"
                >
                  <IconPencil size={18} stroke={1.8} />
                  Editar perfil
                </button>
              </div>
            ) : null}
          </div>

          {canEdit &&
          displayProfile.kind === "organizador" &&
          displayProfile.validationStatus === "not_validated" &&
          !isEditing ? (
            <p className="mt-4 rounded-xl bg-[#f4f0ff] px-4 py-3 text-sm text-[#5b4bb7]">
              Cuando solicites la validación, el equipo de Nexa revisará tu información.
            </p>
          ) : null}
        </section>

        <ProfileFormFields
          isEditing={isEditing}
          isOwnProfile={canEdit}
          isUploadingRepresentative={isUploading}
          onChange={updateDraft}
          onRepresentativeImageSelect={(file) => {
            void handleRepresentativeSelect(file)
          }}
          onSocialLinkChange={updateSocialLink}
          profile={displayProfile}
          representativeUploadError={imageUploadError}
        />

        {canEdit && isEditing ? (
          <div className="flex justify-end gap-3">
            <button
              className="rounded-xl border border-[#dfe6f3] bg-white px-5 py-2.5 text-sm font-semibold text-[#1a3462] transition hover:bg-[#f7f9ff]"
              data-testid="profile-cancel-button"
              onClick={cancelEditing}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="rounded-xl bg-[#6d5ae6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f4ad4]"
              data-testid="profile-save-button"
              onClick={handleSave}
              type="button"
            >
              Guardar cambios
            </button>
          </div>
        ) : null}
      </div>
    </AppShell>
  )
}
