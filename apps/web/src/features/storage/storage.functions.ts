import { createServerFn } from "@tanstack/react-start"
import { uploadImageSchema } from "./validation/storage.schema"
import type { StorageImageKind } from "./types/storage.types"

type UploadImagePayload = {
  fileBase64: string
  fileName: string
  mimeType: string
  kind: StorageImageKind
  ownerId: string
}

function base64ToFile(payload: UploadImagePayload): File {
  const binary = atob(payload.fileBase64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new File([bytes], payload.fileName, { type: payload.mimeType })
}

export const uploadImageFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => uploadImageSchema.parse(data))
  .handler(async ({ data }) => {
    const { uploadImage } = await import("./api/storage.supabase.server")
    const file = base64ToFile(data)

    return uploadImage({
      file,
      kind: data.kind,
      ownerId: data.ownerId,
    })
  })
