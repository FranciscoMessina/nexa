import type { UploadImageInput, UploadImageResult } from "../types/storage.types"
import { buildStoragePath } from "../utils/storage-paths"
import { validateImageFile } from "../utils/validate-image-file"

const MOCK_UPLOAD_DELAY_MS = 300

export async function uploadImage(
  input: UploadImageInput
): Promise<UploadImageResult> {
  validateImageFile(input.file)

  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), MOCK_UPLOAD_DELAY_MS)
  })

  const path = buildStoragePath(input)

  return {
    path,
    publicUrl: URL.createObjectURL(input.file),
  }
}
