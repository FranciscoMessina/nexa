import { mkdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import postgres from "postgres"

const EMAIL = "agustinarios@gmail.com"
const SLUG = "agustina-rios"
const FIRST_NAME = "Agustina"
const LAST_NAME = "Ríos"
const DISPLAY_NAME = "Agustina Ríos"
const HEADLINE =
  "Profesora de yoga y fan de actividades al aire libre en parques y plazas de CABA."
const LOCATION = "Recoleta, CABA"
const DESCRIPTION =
  "Instructora de yoga que disfruta de clases al aire libre, caminatas y propuestas de bienestar en espacios públicos. Me interesan encuentros comunitarios y experiencias activas en la naturaleza urbana."
const INSTAGRAM_HANDLE = "agustina.rios.yoga"

const PHOTO_NATIONALITIES = ["es", "mx", "br", "fr", "de", "nl", "ch"] as const
const MIN_AGE = 18
const MAX_AGE = 35
const MAX_PHOTO_ATTEMPTS = 80

async function fetchMatchingPortrait(): Promise<Buffer> {
  for (let attempt = 0; attempt < MAX_PHOTO_ATTEMPTS; attempt += 1) {
    const seed = `${SLUG}-${attempt}`
    const nat = PHOTO_NATIONALITIES.join(",")
    const apiUrl = `https://randomuser.me/api/?seed=${encodeURIComponent(seed)}&gender=female&nat=${nat}&inc=picture,dob,nat,gender&noinfo`
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

    if (!candidate || candidate.gender !== "female") {
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

  throw new Error(`No se encontró foto femenina para ${DISPLAY_NAME}`)
}

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  const users = await sql<{ id: string; auth_user_id: string | null }[]>`
    SELECT id::text, auth_user_id::text
    FROM users
    WHERE email = ${EMAIL.toLowerCase()}
    LIMIT 1
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
      display_name = ${DISPLAY_NAME},
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

  if (user.auth_user_id) {
    await sql`
      UPDATE auth.users
      SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || ${sql.json({
        displayName: DISPLAY_NAME,
        display_name: DISPLAY_NAME,
        firstName: FIRST_NAME,
        lastName: LAST_NAME,
      })}
      WHERE id = ${user.auth_user_id}::uuid
    `
  }

  await sql.end({ timeout: 5 })
  console.log(`✓ Perfil actualizado: ${DISPLAY_NAME} (${EMAIL})`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
