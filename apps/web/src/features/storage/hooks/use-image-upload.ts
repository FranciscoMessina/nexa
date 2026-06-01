import { useCallback, useState } from "react"
import { storageService } from "../services/storage.service"
import type { StorageImageKind } from "../types/storage.types"
import {
  StorageUploadError,
  StorageValidationError,
} from "../types/storage.types"

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(
    async (
      file: File,
      kind: StorageImageKind,
      ownerId: string
    ): Promise<string | null> => {
      setIsUploading(true)
      setError(null)

      try {
        const result = await storageService.uploadImage({ file, kind, ownerId })
        return result.publicUrl
      } catch (uploadError) {
        if (
          uploadError instanceof StorageValidationError ||
          uploadError instanceof StorageUploadError
        ) {
          setError(uploadError.message)
        } else if (uploadError instanceof Error) {
          setError(uploadError.message)
        } else {
          setError("No se pudo subir la imagen.")
        }
        return null
      } finally {
        setIsUploading(false)
      }
    },
    []
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isUploading,
    error,
    upload,
    clearError,
  }
}
