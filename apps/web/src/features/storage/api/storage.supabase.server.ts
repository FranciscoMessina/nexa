import "@tanstack/react-start/server-only"
import {
  getStorageBucketForEvents,
  getStorageBucketForProfiles,
} from "@/shared/lib/supabase/config.server"
import { createSupabaseServerClientWithSession } from "@/shared/lib/supabase/server"
import type {
  UploadImageInput,
  UploadImageResult,
} from "../types/storage.types"
import { StorageUploadError } from "../types/storage.types"
import { buildStoragePath } from "../utils/storage-paths"
import { validateImageFile } from "../utils/validate-image-file"

function resolveBucket(kind: UploadImageInput["kind"]): string {
  if (kind === "event-gallery") {
    const bucket = getStorageBucketForEvents()
    if (!bucket) {
      throw new StorageUploadError(
        "Configurá SUPABASE_STORAGE_BUCKET o SUPABASE_STORAGE_BUCKET_EVENTS en el servidor."
      )
    }
    return bucket
  }

  const bucket = getStorageBucketForProfiles()
  if (!bucket) {
    throw new StorageUploadError(
      "Configurá SUPABASE_STORAGE_BUCKET o SUPABASE_STORAGE_BUCKET_PROFILES en el servidor."
    )
  }
  return bucket
}

export async function uploadImage(
  input: UploadImageInput
): Promise<UploadImageResult> {
  validateImageFile(input.file)

  const supabase = await createSupabaseServerClientWithSession()
  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (authError || !authData.user) {
    throw new StorageUploadError(
      "Tenés que iniciar sesión para subir archivos a Supabase."
    )
  }

  // Storage RLS policies scope uploads to auth.uid(), not the app user id.
  const path = buildStoragePath({
    ...input,
    ownerId: authData.user.id,
  })
  const bucket = resolveBucket(input.kind)

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, input.file, {
      upsert: true,
      contentType: input.file.type || undefined,
    })

  if (error) {
    throw new StorageUploadError(error.message)
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  if (!data.publicUrl) {
    throw new StorageUploadError(
      "No se pudo obtener la URL pública de la imagen."
    )
  }

  return {
    path,
    publicUrl: data.publicUrl,
  }
}
