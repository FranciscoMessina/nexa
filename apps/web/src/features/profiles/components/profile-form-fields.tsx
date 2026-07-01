import { useRef } from "react"
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandPinterest,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandYoutube,
  IconMail,
  IconMapPin,
  IconPhone,
  IconPlus,
  IconUpload,
  IconX,
} from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"
import type { Profile, SocialPlatform } from "@/features/profiles/types/profile.types"

const socialIconByPlatform = {
  instagram: IconBrandInstagram,
  facebook: IconBrandFacebook,
  twitter: IconBrandTwitter,
  youtube: IconBrandYoutube,
  tiktok: IconBrandTiktok,
  pinterest: IconBrandPinterest,
  linkedin: IconBrandLinkedin,
} as const

function fieldClass(isEditing: boolean): string {
  return cn(
    "w-full rounded-xl border px-3 py-2.5 text-[#1a3462] outline-none transition",
    isEditing
      ? "border-[#d9dfeb] bg-white focus:border-[#6d5ae6] focus:ring-2 focus:ring-[#ebe6ff]"
      : "cursor-default border-[#eef2f8] bg-[#f9fafc]"
  )
}

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  const Icon = socialIconByPlatform[platform]
  return <Icon className="text-[#5b4bb7]" size={18} stroke={1.8} />
}

type ProfileFormFieldsProps = {
  profile: Profile
  isEditing: boolean
  isOwnProfile: boolean
  onChange: (updates: Partial<Profile>) => void
  onSocialLinkChange: (linkId: string, handle: string) => void
  onAddSocialLink?: () => void
  onRemoveSocialLink?: (linkId: string) => void
  onRepresentativeImageSelect?: (file: File) => void
  isUploadingRepresentative?: boolean
  representativeUploadError?: string | null
}

export function ProfileFormFields({
  profile,
  isEditing,
  isOwnProfile,
  onChange,
  onSocialLinkChange,
  onAddSocialLink,
  onRemoveSocialLink,
  onRepresentativeImageSelect,
  isUploadingRepresentative = false,
  representativeUploadError = null,
}: ProfileFormFieldsProps) {
  const representativeInputRef = useRef<HTMLInputElement>(null)
  const nameLabel =
    profile.kind === "usuario"
      ? "Nombre"
      : profile.kind === "emprendimiento"
        ? "Nombre del emprendimiento"
        : "Nombre del organizador"
  const categoryLabel = profile.kind === "emprendimiento" ? "Rubro" : "Categoría"
  const descriptionLimit = profile.kind === "usuario" ? 200 : 300

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <section className="rounded-2xl border border-[#e8edf5] bg-white p-5">
        <h3 className="text-lg font-bold text-[#1e1b4b]">
          {profile.kind === "usuario" ? "Información personal" : "Información general"}
        </h3>
        <div className="mt-4 space-y-4">
          {profile.kind === "usuario" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm">
                <span className="font-semibold text-[#6b7d9c]">Nombre</span>
                <input
                  className={fieldClass(isEditing)}
                  onChange={(event) => {
                    onChange({ firstName: event.target.value })
                  }}
                  readOnly={!isEditing}
                  value={profile.firstName ?? ""}
                />
              </label>
              <label className="space-y-1.5 text-sm">
                <span className="font-semibold text-[#6b7d9c]">Apellido</span>
                <input
                  className={fieldClass(isEditing)}
                  onChange={(event) => {
                    onChange({ lastName: event.target.value })
                  }}
                  readOnly={!isEditing}
                  value={profile.lastName ?? ""}
                />
              </label>
            </div>
          ) : (
            <>
              <label className="block space-y-1.5 text-sm">
                <span className="font-semibold text-[#6b7d9c]">{nameLabel}</span>
                <input
                  className={fieldClass(isEditing)}
                  onChange={(event) => {
                    onChange({ displayName: event.target.value })
                  }}
                  readOnly={!isEditing}
                  value={profile.displayName}
                />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span className="font-semibold text-[#6b7d9c]">Resumen</span>
                <textarea
                  className={cn(fieldClass(isEditing), "min-h-20 resize-none")}
                  onChange={(event) => {
                    onChange({ headline: event.target.value })
                  }}
                  readOnly={!isEditing}
                  value={profile.headline}
                />
              </label>
            </>
          )}

          <label className="block space-y-1.5 text-sm">
            <span className="font-semibold text-[#6b7d9c]">Ubicación</span>
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2.5",
                isEditing ? "border-[#d9dfeb] bg-white" : "border-[#eef2f8] bg-[#f9fafc]"
              )}
            >
              <IconMapPin className="text-[#8a9bb8]" size={18} stroke={1.8} />
              <input
                className="w-full border-none bg-transparent text-[#1a3462] outline-none"
                onChange={(event) => {
                  onChange({ location: event.target.value })
                }}
                readOnly={!isEditing}
                value={profile.location}
              />
            </div>
          </label>

          {profile.kind === "usuario" ? (
            <>
              <label className="block space-y-1.5 text-sm">
                <span className="font-semibold text-[#6b7d9c]">Fecha de nacimiento</span>
                <input
                  className={fieldClass(isEditing)}
                  onChange={(event) => {
                    onChange({ birthDate: event.target.value })
                  }}
                  readOnly={!isEditing}
                  type={isEditing ? "date" : "text"}
                  value={
                    isEditing
                      ? (profile.birthDate ?? "")
                      : new Intl.DateTimeFormat("es-AR").format(
                          new Date(profile.birthDate ?? "1998-08-15")
                        )
                  }
                />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span className="font-semibold text-[#6b7d9c]">Sobre mí</span>
                <textarea
                  className={cn(fieldClass(isEditing), "min-h-28 resize-none")}
                  maxLength={descriptionLimit}
                  onChange={(event) => {
                    onChange({ description: event.target.value })
                  }}
                  readOnly={!isEditing}
                  value={profile.description}
                />
                <span className="text-xs text-[#8a9bb8]">
                  {profile.description.length}/{descriptionLimit}
                </span>
              </label>
            </>
          ) : (
            <>
              <label className="block space-y-1.5 text-sm">
                <span className="font-semibold text-[#6b7d9c]">{categoryLabel}</span>
                <input
                  className={fieldClass(isEditing)}
                  onChange={(event) => {
                    onChange({ categoryLabel: event.target.value })
                  }}
                  readOnly={!isEditing}
                  value={profile.categoryLabel}
                />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span className="font-semibold text-[#6b7d9c]">Descripción</span>
                <textarea
                  className={cn(fieldClass(isEditing), "min-h-28 resize-none")}
                  maxLength={descriptionLimit}
                  onChange={(event) => {
                    onChange({ description: event.target.value })
                  }}
                  readOnly={!isEditing}
                  value={profile.description}
                />
                <span className="text-xs text-[#8a9bb8]">
                  {profile.description.length}/{descriptionLimit}
                </span>
              </label>
            </>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[#e8edf5] bg-white p-5">
        <h3 className="text-lg font-bold text-[#1e1b4b]">
          {profile.kind === "usuario" ? "Datos de contacto" : "Redes sociales"}
        </h3>

        {profile.kind === "usuario" ? (
          <div className="mt-4 space-y-4">
            <label className="block space-y-1.5 text-sm">
              <span className="font-semibold text-[#6b7d9c]">Correo electrónico</span>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2.5",
                  isEditing ? "border-[#d9dfeb] bg-white" : "border-[#eef2f8] bg-[#f9fafc]"
                )}
              >
                <IconMail className="text-[#8a9bb8]" size={18} stroke={1.8} />
                <input
                  className="w-full border-none bg-transparent text-[#1a3462] outline-none"
                  onChange={(event) => {
                    onChange({ email: event.target.value })
                  }}
                  readOnly={!isEditing}
                  value={profile.email ?? ""}
                />
              </div>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-semibold text-[#6b7d9c]">Teléfono</span>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2.5",
                  isEditing ? "border-[#d9dfeb] bg-white" : "border-[#eef2f8] bg-[#f9fafc]"
                )}
              >
                <IconPhone className="text-[#8a9bb8]" size={18} stroke={1.8} />
                <input
                  className="w-full border-none bg-transparent text-[#1a3462] outline-none"
                  onChange={(event) => {
                    onChange({ phone: event.target.value })
                  }}
                  readOnly={!isEditing}
                  value={profile.phone ?? ""}
                />
              </div>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-semibold text-[#6b7d9c]">Ciudad</span>
              <input
                className={fieldClass(isEditing)}
                onChange={(event) => {
                  onChange({ city: event.target.value })
                }}
                readOnly={!isEditing}
                value={profile.city ?? ""}
              />
            </label>
          </div>
        ) : (
          <>
            <ul className="mt-4 space-y-3">
              {profile.socialLinks.map((link) => (
                <li
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#edf1f7] px-3 py-2.5"
                  key={link.id}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <SocialIcon platform={link.platform} />
                    {isEditing ? (
                      <input
                        className="w-full border-none bg-transparent text-sm font-medium text-[#1a3462] outline-none"
                        onChange={(event) => {
                          onSocialLinkChange(link.id, event.target.value)
                        }}
                        value={link.handle}
                      />
                    ) : (
                      <span className="truncate text-sm font-medium text-[#1a3462]">
                        {link.handle}
                      </span>
                    )}
                  </div>
                  {isOwnProfile && isEditing ? (
                    <button
                      className="text-[#8a9bb8]"
                      onClick={() => {
                        onRemoveSocialLink?.(link.id)
                      }}
                      type="button"
                    >
                      <IconX size={16} stroke={1.8} />
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
            {isOwnProfile && isEditing ? (
              <button
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5b4bb7]"
                onClick={onAddSocialLink}
                type="button"
              >
                <IconPlus size={16} stroke={2} />
                Agregar red social
              </button>
            ) : null}
          </>
        )}
      </section>

      <section className="rounded-2xl border border-[#e8edf5] bg-white p-5">
        <h3 className="text-lg font-bold text-[#1e1b4b]">
          {profile.kind === "usuario" ? "Redes sociales" : "Imagen representativa"}
        </h3>

        {profile.kind === "usuario" ? (
          <SocialLinksList
            isEditing={isEditing}
            isOwnProfile={isOwnProfile}
            onAddSocialLink={onAddSocialLink}
            onRemoveSocialLink={onRemoveSocialLink}
            onSocialLinkChange={onSocialLinkChange}
            profile={profile}
          />
        ) : (
          <>
            <p className="mt-2 text-sm text-[#6b7d9c]">
              Esta imagen se mostrará en tu perfil y en tus eventos.
            </p>
            <img
              alt={profile.displayName}
              className="mt-4 h-44 w-full rounded-2xl object-cover"
              src={profile.representativeImageUrl}
            />
            {isOwnProfile && isEditing ? (
              <>
                <input
                  accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file && onRepresentativeImageSelect) {
                      onRepresentativeImageSelect(file)
                    }
                    event.target.value = ""
                  }}
                  ref={representativeInputRef}
                  type="file"
                />
                <button
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#dfe6f3] px-4 py-2.5 text-sm font-semibold text-[#1a3462] disabled:opacity-60"
                  disabled={isUploadingRepresentative}
                  onClick={() => {
                    representativeInputRef.current?.click()
                  }}
                  type="button"
                >
                  <IconUpload size={18} stroke={1.8} />
                  {isUploadingRepresentative ? "Subiendo…" : "Cambiar imagen"}
                </button>
                <p className="mt-2 text-xs text-[#8a9bb8]">Formatos permitidos: JPG, PNG. Máx. 5MB.</p>
                {representativeUploadError ? (
                  <p className="mt-1 text-xs text-rose-600">{representativeUploadError}</p>
                ) : null}
              </>
            ) : null}
          </>
        )}
      </section>
    </div>
  )
}

function SocialLinksList({
  profile,
  isEditing,
  isOwnProfile,
  onSocialLinkChange,
  onAddSocialLink,
  onRemoveSocialLink,
}: {
  profile: Profile
  isEditing: boolean
  isOwnProfile: boolean
  onSocialLinkChange: (linkId: string, handle: string) => void
  onAddSocialLink?: () => void
  onRemoveSocialLink?: (linkId: string) => void
}) {
  return (
    <>
      <ul className="mt-4 space-y-3">
        {profile.socialLinks.map((link) => (
          <li
            className="flex items-center justify-between gap-3 rounded-xl border border-[#edf1f7] px-3 py-2.5"
            key={link.id}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <SocialIcon platform={link.platform} />
              {isEditing ? (
                <input
                  className="w-full border-none bg-transparent text-sm font-medium text-[#1a3462] outline-none"
                  onChange={(event) => {
                    onSocialLinkChange(link.id, event.target.value)
                  }}
                  value={link.handle}
                />
              ) : (
                <span className="truncate text-sm font-medium text-[#1a3462]">{link.handle}</span>
              )}
            </div>
            {isOwnProfile && isEditing ? (
              <button
                className="text-[#8a9bb8]"
                onClick={() => {
                  onRemoveSocialLink?.(link.id)
                }}
                type="button"
              >
                <IconX size={16} stroke={1.8} />
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      {isOwnProfile && isEditing ? (
        <button
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5b4bb7]"
          onClick={onAddSocialLink}
          type="button"
        >
          <IconPlus size={16} stroke={2} />
          Agregar red social
        </button>
      ) : null}
    </>
  )
}
