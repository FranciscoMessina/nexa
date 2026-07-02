import postgres from "postgres"

/** Mayúscula en palabras sustantivas; artículos/preposiciones en minúscula (salvo al inicio). */
const TITLE_FIXES: Record<string, string> = {
  "After office con DJ en Blest Recoleta": "After Office con DJ en Blest Recoleta",
  "After office funk & soul en Colegiales": "After Office Funk & Soul en Colegiales",
  "Banda de Rock en vivo en Bar Basílico": "Banda de Rock en Vivo en Bar Basílico",
  "Cata de cafés de especialidad en Colegiales": "Cata de Cafés de Especialidad en Colegiales",
  "Clase abierta de fotografía": "Clase Abierta de Fotografía",
  "Clase de baile en Colegiales": "Clase de Baile en Colegiales",
  "Clase de yoga abierta en Plaza Francia": "Clase de Yoga Abierta en Plaza Francia",
  "Club de lectura en Café Rita": "Club de Lectura en Café Rita",
  "DJ set en vivo en Blest Recoleta": "DJ Set en Vivo en Blest Recoleta",
  "Encuentro de lectura de poesías en Clorindo": "Encuentro de Lectura de Poesías en Clorindo",
  "Encuentro de poesía en Monserrat": "Encuentro de Poesía en Monserrat",
  "Exhibición de tango en Av. de Mayo": "Exhibición de Tango en Av. de Mayo",
  "Feria de comida en Pasaje Colegiales": "Feria de Comida en Pasaje Colegiales",
  "Feria de ropa en Cofi Jaus Palermo": "Feria de Ropa en Cofi Jaus Palermo",
  "Feria gastronómica": "Feria Gastronómica",
  "Intercambio cultural": "Intercambio Cultural",
  "Intercambio de figuritas del Mundial": "Intercambio de Figuritas del Mundial",
  "Intercambio de idiomas en Nela Café & Arte": "Intercambio de Idiomas en Nela Café & Arte",
  "Jazz & cócteles en Palacio Barolo": "Jazz & Cócteles en Palacio Barolo",
  "Muestra de arte en vivo en El Federal Bar": "Muestra de Arte en Vivo en El Federal Bar",
  "Noche de juegos de cartas en Kansas": "Noche de Juegos de Cartas en Kansas",
  "Noche de juegos de mesa en Café Registrado": "Noche de Juegos de Mesa en Café Registrado",
  "Noche de pizza y música en Güerrín": "Noche de Pizza y Música en Güerrín",
  "Noche de stand-up en Fitz Roy": "Noche de Stand-up en Fitz Roy",
  "Noche de vermú y stands en Conde": "Noche de Vermú y Stands en Conde",
  "Pop-up de marcas de ropa en Bar Tabac": "Pop-up de Marcas de Ropa en Bar Tabac",
  "Promo de vinos en Brutal": "Promo de Vinos en Brutal",
  "Running matutino en Almagro": "Running Matutino en Almagro",
  "Show de tango en vivo en El Federal Bar": "Show de Tango en Vivo en El Federal Bar",
  "Sunset & vinilos en rooftop de Palermo Hollywood": "Sunset & Vinilos en Rooftop de Palermo Hollywood",
  "Sunset electrónico en patio de Dorrego": "Sunset Electrónico en Patio de Dorrego",
  "Taller abierto de cerámica en Chacarita": "Taller Abierto de Cerámica en Chacarita",
  "Taller de acuarela en Café Walden": "Taller de Acuarela en Café Walden",
  "Taller de cerámica en Clorindo Café": "Taller de Cerámica en Clorindo Café",
  "Taller de collage": "Taller de Collage",
  "Taller de pintura": "Taller de Pintura",
  "Taller de pintura en Estudio Dorrego": "Taller de Pintura en Estudio Dorrego",
  "Taller de velas artesanales": "Taller de Velas Artesanales",
  "Vinilos & electrónica en Nicaragua": "Vinilos & Electrónica en Nicaragua",
  "Workshop de acuarela": "Workshop de Acuarela",
  "Yoga al aire libre en Plaza Rubén Darío": "Yoga al Aire Libre en Plaza Rubén Darío",
}

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })
  const events = await sql<{ id: string; title: string | null }[]>`
    SELECT id::text, title FROM events WHERE title IS NOT NULL
  `

  let updated = 0
  for (const event of events) {
    const nextTitle = TITLE_FIXES[event.title ?? ""]
    if (!nextTitle || nextTitle === event.title) continue

    await sql`
      UPDATE events
      SET title = ${nextTitle}, updated_at = NOW()
      WHERE id = ${event.id}::uuid
    `
    console.log(`✓ ${event.title} → ${nextTitle}`)
    updated++
  }

  await sql.end({ timeout: 5 })
  console.log(`\nListo. ${updated} título(s) actualizado(s).`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
