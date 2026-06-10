import { cn } from "@workspace/ui/lib/utils"

type ProfileAvatarSize = "sm" | "lg"

type ProfileAvatarProps = {
  alt: string
  src: string
  size?: ProfileAvatarSize
  className?: string
}

const sizeClasses: Record<ProfileAvatarSize, string> = {
  sm: "size-12 ring-2",
  lg: "size-24 ring-4",
}

export function ProfileAvatar({
  alt,
  src,
  size = "lg",
  className,
}: ProfileAvatarProps) {
  const initials = alt
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-[#111111] shadow-md ring-white",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img
          alt={alt}
          className="block size-full object-cover"
          draggable={false}
          src={src}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-xs font-bold tracking-wide text-[#d4d4d4]">
          {initials || "?"}
        </div>
      )}
    </div>
  )
}
