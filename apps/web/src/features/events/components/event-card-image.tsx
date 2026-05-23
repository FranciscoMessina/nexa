import { IconPhoto } from "@tabler/icons-react"
import { useState } from "react"

type EventCardImageProps = {
  alt: string
  src: string
}

export function EventCardImage({ alt, src }: EventCardImageProps) {
  const [hasError, setHasError] = useState(false)

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#e8edf5]">
      {hasError ? (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-[#fff5ef] to-[#f0f4ff] text-[#8a9bb8]"
          data-testid="event-image-fallback"
        >
          <IconPhoto size={32} stroke={1.5} />
          <span className="text-xs font-medium">Imagen no disponible</span>
        </div>
      ) : (
        <img
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => {
            setHasError(true)
          }}
          src={src}
        />
      )}
    </div>
  )
}
