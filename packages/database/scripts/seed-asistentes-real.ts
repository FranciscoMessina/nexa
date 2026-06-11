import { randomUUID } from "node:crypto"
import { mkdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import postgres from "postgres"
import { getSeedDevPassword, insertSeedAuthUsers } from "./seed-auth"

type AsistenteSeed = {
  email: string
  slug: string
  firstName: string
  lastName: string
  displayName: string
  gender: "female" | "male"
  headline: string
  location: string
  description: string
  birthDate: string
  phone: string
  instagramHandle: string
}

const ASISTENTES: Array<AsistenteSeed> = [
  {
    email: "trinidadechevarria_@hotmail.com",
    slug: "trinidad-echevarria",
    firstName: "Trinidad",
    lastName: "Echevarría",
    displayName: "Trinidad Echevarría",
    gender: "female",
    headline: "Busco experiencias culturales, música en vivo y eventos con propuesta local en CABA.",
    location: "Belgrano, CABA",
    description:
      "Me interesan ferias de diseño, conciertos íntimos y encuentros gastronómicos. Siempre atenta a propuestas nuevas en la ciudad.",
    birthDate: "1999-04-12",
    phone: "+54 11 4521 8834",
    instagramHandle: "trinidad.echevarria",
  },
  {
    email: "sofiamartinez@hotmail.com",
    slug: "sofia-martinez",
    firstName: "Sofía",
    lastName: "Martínez",
    displayName: "Sofía Martínez",
    gender: "female",
    headline: "Fanática de brunchs, cafés de especialidad y eventos al aire libre en Palermo.",
    location: "Palermo, CABA",
    description:
      "Disfruto descubrir nuevos bares, markets y propuestas creativas. Me gusta asistir a eventos sociales y de emprendedores.",
    birthDate: "1997-11-03",
    phone: "+54 11 4789 2210",
    instagramHandle: "sofiamartinez.ba",
  },
  {
    email: "martinlopez@outlook.com",
    slug: "martin-lopez",
    firstName: "Martín",
    lastName: "López",
    displayName: "Martín López",
    gender: "male",
    headline: "After office, cerveza artesanal y networking en Puerto Madero y Recoleta.",
    location: "Recoleta, CABA",
    description:
      "Asisto a eventos corporativos informales, catas y lanzamientos. Me interesa conocer gente y nuevas marcas.",
    birthDate: "1994-07-22",
    phone: "+54 11 5033 7741",
    instagramHandle: "martinlopez.caba",
  },
  {
    email: "agustinarios@gmail.com",
    slug: "agustina-rios",
    firstName: "Agustina",
    lastName: "Ríos",
    displayName: "Agustina Ríos",
    gender: "female",
    headline: "Profesora de yoga y fan de actividades al aire libre en parques y plazas de CABA.",
    location: "Recoleta, CABA",
    description:
      "Instructora de yoga que disfruta de clases al aire libre, caminatas y propuestas de bienestar en espacios públicos. Me interesan encuentros comunitarios y experiencias activas en la naturaleza urbana.",
    birthDate: "1996-02-18",
    phone: "+54 11 4567 9023",
    instagramHandle: "agustina.rios.yoga",
  },
  {
    email: "tomasferreyra@yahoo.com",
    slug: "tomas-ferreyra",
    firstName: "Tomás",
    lastName: "Ferreyra",
    displayName: "Tomás Ferreyra",
    gender: "male",
    headline: "Música electrónica, vinilos y noches de DJ en Palermo Hollywood.",
    location: "Palermo Hollywood, CABA",
    description:
      "Sigo la escena de DJs y eventos nocturnos. Me encantan los sunsets, rooftops y propuestas con buena curaduría musical.",
    birthDate: "1995-09-08",
    phone: "+54 11 4890 6612",
    instagramHandle: "tomasferreyra.dj",
  },
  {
    email: "luciadiaz@hotmail.com",
    slug: "lucia-diaz",
    firstName: "Lucía",
    lastName: "Díaz",
    displayName: "Lucía Díaz",
    gender: "female",
    headline: "Lectura, poesía y encuentros literarios en Recoleta y la Ciudad.",
    location: "Recoleta, CABA",
    description:
      "Me encanta leer y compartir textos en voz alta. Coordino una comunidad de lectura de poesías y busco espacios íntimos para reunirnos y descubrir nuevas voces.",
    birthDate: "1998-01-25",
    phone: "+54 11 4362 1188",
    instagramHandle: "luciadiaz.poesia",
  },
  {
    email: "nico.pereyra@gmail.com",
    slug: "nico-pereyra",
    firstName: "Nico",
    lastName: "Pereyra",
    displayName: "Nico Pereyra",
    gender: "male",
    headline: "Me interesan los intercambios de idiomas y conocer gente de distintas culturas en Buenos Aires.",
    location: "Palermo, CABA",
    description:
      "Me gustan los encuentros para practicar idiomas y charlar con viajeros y locales. Disfruto de espacios relajados donde se compartan culturas, historias y ganas de aprender.",
    birthDate: "1993-12-14",
    phone: "+54 11 4922 3301",
    instagramHandle: "nicopereyra.idiomas",
  },
  {
    email: "camilasantos@outlook.com",
    slug: "camila-santos",
    firstName: "Camila",
    lastName: "Santos",
    displayName: "Camila Santos",
    gender: "female",
    headline: "Moda independiente, ferias de emprendedores y pop-ups en Palermo Soho.",
    location: "Palermo Soho, CABA",
    description:
      "Busco diseño local, markets y eventos de moda. Me gusta descubrir marcas emergentes y propuestas sustentables.",
    birthDate: "2000-06-30",
    phone: "+54 11 4777 5540",
    instagramHandle: "camilasantos.moda",
  },
  {
    email: "joaquinsuarez@hotmail.com",
    slug: "joaquin-suarez",
    firstName: "Joaquín",
    lastName: "Suárez",
    displayName: "Joaquín Suárez",
    gender: "male",
    headline: "Entrenador personal y apasionado del deporte al aire libre en Vicente López y Zona Norte.",
    location: "Vicente López, Buenos Aires",
    description:
      "Me encanta el running y entrenar en grupo. Coordino salidas en la costanera y busco sumar gente nueva que quiera probar mis entrenamientos de forma accesible y en buen clima.",
    birthDate: "1992-08-09",
    phone: "+54 11 4555 9020",
    instagramHandle: "joaquinsuarez.run",
  },
  {
    email: "emiliafernandez@gmail.com",
    slug: "emilia-fernandez",
    firstName: "Emilia",
    lastName: "Fernández",
    displayName: "Emilia Fernández",
    gender: "female",
    headline: "Gastronomía, vermut y experiencias compartidas en bares de barrio.",
    location: "Villa Urquiza, CABA",
    description:
      "Me encantan las degustaciones, picadas y eventos gastronómicos. Siempre buscando nuevos lugares para compartir con amigos.",
    birthDate: "1999-10-17",
    phone: "+54 11 4522 7719",
    instagramHandle: "emilia.fernandez.gastro",
  },
]

type RandomUserResult = {
  picture: { large: string }
  dob: { age: number }
  nat: string
  gender: "female" | "male"
}

const PHOTO_NATIONALITIES = ["es", "mx", "br", "fr", "de", "nl", "ch"] as const
const MIN_AGE = 18
const MAX_AGE = 35
const MAX_PHOTO_ATTEMPTS = 40

async function fetchMatchingPortrait(profile: AsistenteSeed): Promise<Buffer> {
  for (let attempt = 0; attempt < MAX_PHOTO_ATTEMPTS; attempt += 1) {
    const seed = `${profile.slug}-${attempt}`
    const nat = PHOTO_NATIONALITIES.join(",")
    const apiUrl = `https://randomuser.me/api/?seed=${encodeURIComponent(seed)}&gender=${profile.gender}&nat=${nat}&inc=picture,dob,nat,gender&noinfo`
    const response = await fetch(apiUrl)

    if (!response.ok) {
      continue
    }

    const payload = (await response.json()) as { results: Array<RandomUserResult> }
    const candidate = payload.results[0]

    if (!candidate) {
      continue
    }

    if (candidate.gender !== profile.gender) {
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

  throw new Error(
    `No se encontró foto (${profile.gender}, ${MIN_AGE}-${MAX_AGE} años) para ${profile.displayName} tras ${MAX_PHOTO_ATTEMPTS} intentos`
  )
}

async function downloadProfilePhotos(
  profile: AsistenteSeed,
  avatarPath: string,
  representativePath: string
): Promise<void> {
  const imageBuffer = await fetchMatchingPortrait(profile)

  await sharp(imageBuffer).resize(512, 512, { fit: "cover", position: "top" }).png().toFile(avatarPath)

  await sharp(imageBuffer)
    .resize(1600, 900, { fit: "cover", position: "centre" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(representativePath)
}

async function ensureAuthUser(sql: postgres.Sql, profile: AsistenteSeed): Promise<string> {
  const existing = await sql<{ id: string }[]>`
    SELECT id::text FROM auth.users WHERE email = ${profile.email.toLowerCase()} LIMIT 1
  `

  if (existing[0]) {
    return existing[0].id
  }

  const authUserId = randomUUID()

  await insertSeedAuthUsers(sql, [
    {
      id: authUserId,
      email: profile.email.toLowerCase(),
      displayName: profile.displayName,
      role: "asistente",
      canSignIn: true,
    },
  ])

  return authUserId
}

async function upsertAsistenteProfile(
  sql: postgres.Sql,
  authUserId: string,
  profile: AsistenteSeed,
  avatarUrl: string,
  representativeImageUrl: string
): Promise<void> {
  const existing = await sql<{ id: string }[]>`
    SELECT id::text FROM users
    WHERE auth_user_id = ${authUserId}::uuid OR email = ${profile.email.toLowerCase()}
    LIMIT 1
  `

  let userId = existing[0]?.id

  if (!userId) {
    const inserted = await sql<{ id: string }[]>`
      INSERT INTO users (
        auth_user_id,
        role,
        display_name,
        headline,
        location,
        description,
        avatar_url,
        representative_image_url,
        email,
        phone,
        birth_date,
        accepts_email_communications
      )
      VALUES (
        ${authUserId}::uuid,
        'asistente',
        ${profile.displayName},
        ${profile.headline},
        ${profile.location},
        ${profile.description},
        ${avatarUrl},
        ${representativeImageUrl},
        ${profile.email.toLowerCase()},
        ${profile.phone},
        ${profile.birthDate},
        true
      )
      RETURNING id::text
    `

    userId = inserted[0]?.id
    if (!userId) {
      throw new Error(`No se pudo crear usuario público para ${profile.email}`)
    }
  } else {
    await sql`
      UPDATE users
      SET
        auth_user_id = ${authUserId}::uuid,
        role = 'asistente',
        display_name = ${profile.displayName},
        headline = ${profile.headline},
        location = ${profile.location},
        description = ${profile.description},
        avatar_url = ${avatarUrl},
        representative_image_url = ${representativeImageUrl},
        email = ${profile.email.toLowerCase()},
        phone = ${profile.phone},
        birth_date = ${profile.birthDate},
        accepts_email_communications = true,
        updated_at = NOW()
      WHERE id = ${userId}::uuid
    `
  }

  await sql`
    DELETE FROM user_social_links
    WHERE user_id = ${userId}::uuid AND platform = 'instagram'
  `

  await sql`
    INSERT INTO user_social_links (user_id, platform, handle)
    VALUES (${userId}::uuid, 'instagram', ${profile.instagramHandle})
  `

  await sql`
    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || ${sql.json({
      role: "asistente",
      displayName: profile.displayName,
      display_name: profile.displayName,
      firstName: profile.firstName,
      lastName: profile.lastName,
    })}
    WHERE id = ${authUserId}::uuid
  `
}

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  getSeedDevPassword()

  const sql = postgres(connectionString, { prepare: false, max: 1 })
  const publicRoot = path.resolve(import.meta.dir, "../../../apps/web/public/profiles")

  for (const profile of ASISTENTES) {
    const authUserId = await ensureAuthUser(sql, profile)

    const dir = path.join(publicRoot, profile.slug)
    await mkdir(dir, { recursive: true })

    const avatarPath = path.join(dir, "avatar.png")
    const representativePath = path.join(dir, "representative.jpg")

    await downloadProfilePhotos(profile, avatarPath, representativePath)

    const avatarUrl = `/profiles/${profile.slug}/avatar.png`
    const representativeImageUrl = `/profiles/${profile.slug}/representative.jpg`

    await upsertAsistenteProfile(sql, authUserId, profile, avatarUrl, representativeImageUrl)

    console.log(`✓ ${profile.displayName} (${profile.email})`)
  }

  await sql.end({ timeout: 5 })
  console.log("Listo. Contraseña de login: SEED_DEV_PASSWORD (.env.local)")
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
