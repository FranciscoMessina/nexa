import { mkdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

type OptimizeProfileImagesInput = {
  slug: string
  /** 0–1 vertical focus for representative crop (0.5 = center). */
  representativeFocusY?: number
}

export async function optimizeProfileImages(
  input: OptimizeProfileImagesInput
): Promise<void> {
  const publicRoot = path.resolve(import.meta.dir, "../../../apps/web/public/profiles")
  const dir = path.join(publicRoot, input.slug)
  await mkdir(dir, { recursive: true })

  const avatarInput = path.join(dir, "avatar.png")
  const representativeInput = path.join(dir, "representative.png")
  const avatarOutput = path.join(dir, "avatar-optimized.png")
  const representativeOutput = path.join(dir, "representative-optimized.png")

  const avatarMeta = await sharp(avatarInput).metadata()
  const avatarSize = Math.min(avatarMeta.width ?? 512, avatarMeta.height ?? 512, 512)

  await sharp(avatarInput)
    .resize(avatarSize, avatarSize, { fit: "cover", position: "centre" })
    .png({ compressionLevel: 9, palette: false })
    .toFile(avatarOutput)

  const representativeMeta = await sharp(representativeInput).metadata()
  const sourceWidth = representativeMeta.width ?? 1600
  const sourceHeight = representativeMeta.height ?? 900
  const targetAspect = 16 / 9
  const sourceAspect = sourceWidth / sourceHeight

  let extractWidth = sourceWidth
  let extractHeight = sourceHeight
  let left = 0
  let top = 0

  if (sourceAspect > targetAspect) {
    extractWidth = Math.round(sourceHeight * targetAspect)
    left = Math.round((sourceWidth - extractWidth) / 2)
  } else {
    extractHeight = Math.round(sourceWidth / targetAspect)
    const focusY = input.representativeFocusY ?? 0.42
    top = Math.round((sourceHeight - extractHeight) * focusY)
    top = Math.max(0, Math.min(top, sourceHeight - extractHeight))
  }

  await sharp(representativeInput)
    .extract({ left, top, width: extractWidth, height: extractHeight })
    .resize(1600, 900, { fit: "fill" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(representativeOutput.replace(/\.png$/, ".jpg"))

  console.log(`Optimized avatar: ${avatarOutput}`)
  console.log(`Optimized representative: ${representativeOutput.replace(/\.png$/, ".jpg")}`)
}

async function main(): Promise<void> {
  await optimizeProfileImages({
    slug: "blest",
    representativeFocusY: 0.35,
  })
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
