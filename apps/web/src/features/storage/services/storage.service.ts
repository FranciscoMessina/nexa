import { getSessionFn, getSupabaseStatusFn } from "@/features/auth/auth.functions"
import * as storageMock from "../api/storage.mock"
import type { UploadImageInput, UploadImageResult } from "../types/storage.types"
import { uploadImageFn } from "../storage.functions"
import { fileToBase64 } from "../utils/file-to-base64"

let supabaseConfiguredCache: boolean | null = null

async function isSupabaseConfiguredOnServer(): Promise<boolean> {
  if (supabaseConfiguredCache !== null) {
    return supabaseConfiguredCache
  }

  const status = await getSupabaseStatusFn()
  supabaseConfiguredCache = status.configured
  return status.configured
}

async function hasSupabaseSession(): Promise<boolean> {
  const { user } = await getSessionFn()
  return user !== null
}

async function uploadImage(input: UploadImageInput): Promise<UploadImageResult> {
  if ((await isSupabaseConfiguredOnServer()) && (await hasSupabaseSession())) {
    const fileBase64 = await fileToBase64(input.file)

    return uploadImageFn({
      data: {
        fileBase64,
        fileName: input.file.name,
        mimeType: input.file.type || "application/octet-stream",
        kind: input.kind,
        ownerId: input.ownerId,
      },
    })
  }

  return storageMock.uploadImage(input)
}

export const storageService = {
  uploadImage,
}

export default storageService
