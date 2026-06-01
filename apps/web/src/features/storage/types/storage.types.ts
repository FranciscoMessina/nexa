export type StorageImageKind = "avatar" | "representative" | "event-gallery"

export type UploadImageInput = {
  file: File
  kind: StorageImageKind
  ownerId: string
}

export type UploadImageResult = {
  publicUrl: string
  path: string
}

export class StorageValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "StorageValidationError"
  }
}

export class StorageUploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "StorageUploadError"
  }
}
