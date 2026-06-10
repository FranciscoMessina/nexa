import { mkdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import postgres from "postgres"

const EMAIL = "joaquinsuarez@hotmail.com"
const SLUG = "joaquin-suarez"
const HEADLINE =
  "Entrenador personal y apasionado del deporte al aire libre en Vicente López y Zona Norte."
const LOCATION = "Vicente López, Buenos Aires"
const DESCRIPTION =
  "Me encanta el running y entrenar en grupo. Coordino salidas en la costanera y busco sumar gente nueva que quiera probar mis entrenamientos de forma accesible y en buen clima."
const INSTAGRAM_HANDLE = "joaquinsuarez.run"

const PHOTO_NATIONALITIES = ["es", "mx", "br", "fr", "de", "nl", "ch"] as const
const MIN_AGE = 18
const MAX_AGE = 35
const MAX_PHOTO_ATTEMPTS = 80

async function fetchMatchingPortrait(): Promise<Buffer> {
  for (let attempt = 0; attempt < MAX_PHOTO_ATTEMPTS; attempt += 1) {
    const seed = `${SLUG}-${attempt}`
    const nat = PHOTO_NATIONALITIES.join(",")
    const apiUrl = `https://randomuser.me/api/?seed=${encodeURIComponent(seed)}&gender=male&nat=${nat}&inc=picture,dob,nat,gender&noinfo`
    const response = await fetch(apiUrl)

    if (!response.ok) {
      continue
    }

    const payload = (await response.json()) as {
      results: Array<{
        picture: { large: string }
        dob: { age: number }
        gender: "female" | "male"
      }>
    }
    const candidate = payload.results[0]

    if (!candidate || candidate.gender !== "male") {
      continue
    }

    const age = candidate.dob.age
    if (age < MIN_AGE || age > MAX_AGE) {
      continue
    }

    const imageResponse = await fetch(candidate.picture.large)
    if (!imageResponse.ok) {
      continue
    }

    return Buffer.from(await imageResponse.arrayBuffer())
  }

  throw new Error(`No se encontró foto masculina para Joaquín Suárez`)
}

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  const users = await sql<{ id: string }[]>`
    SELECT id::text FROM users WHERE email = ${EMAIL.toLowerCase()} LIMIT 1
  `

  const user = users[0]
  if (!user) {
    throw new Error(`No se encontró usuario ${EMAIL}`)
  }

  const publicRoot = path.resolve(import.meta.dir, "../../../apps/web/public/profiles")
  const dir = path.join(publicRoot, SLUG)
  await mkdir(dir, { recursive: true })

  const avatarPath = path.join(dir, "avatar.png")
  const representativePath = path.join(dir, "representative.jpg")
  const imageBuffer = await fetchMatchingPortrait()

  await sharp(imageBuffer).resize(512, 512, { fit: "cover", position: "top" }).png().toFile(avatarPath)
  await sharp(imageBuffer)
    .resize(1600, 900, { fit: "cover", position: "centre" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(representativePath)

  const avatarUrl = `/profiles/${SLUG}/avatar.png`
  const representativeImageUrl = `/profiles/${SLUG}/representative.jpg`

  await sql`
    UPDATE users
    SET
      headline = ${HEADLINE},
      location = ${LOCATION},
      description = ${DESCRIPTION},
      avatar_url = ${avatarUrl},
      representative_image_url = ${representativeImageUrl},
      updated_at = NOW()
    WHERE id = ${user.id}::uuid
  `

  await sql`
    DELETE FROM user_social_links
    WHERE user_id = ${user.id}::uuid AND platform = 'instagram'
  `

  await sql`
    INSERT INTO user_social_links (user_id, platform, handle)
    VALUES (${user.id}::uuid, 'instagram', ${INSTAGRAM_HANDLE})
  `

  await sql.end({ timeout: 5 })
  console.log(`✓ Perfil y fotos actualizados: Joaquín Suárez (${EMAIL})`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
