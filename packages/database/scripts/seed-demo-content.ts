/**
 * Ejecuta en orden todos los seeds de contenido demo (perfiles + eventos).
 * Idempotente: se puede correr varias veces contra la misma base.
 *
 * Requiere usuarios ya creados en Supabase Auth (organizadores, emprendedores, asistentes).
 * Usa las mismas env vars que el resto del proyecto (apps/web/.env.local).
 */
import { spawnSync } from "node:child_process"
import path from "node:path"

const SCRIPTS = [
  "seed-organizers-real.ts",
  "seed-emprendedores-real.ts",
  "seed-asistentes-real.ts",
  "update-organizer-profile.ts",
  "update-asistente-agustin.ts",
  "update-asistente-lucia.ts",
  "update-asistente-joaquin.ts",
  "update-asistente-nico.ts",
  "seed-event-agustin-yoga.ts",
  "seed-event-lucia-poesia.ts",
  "seed-event-joaquin-running.ts",
  "seed-event-nico-idiomas.ts",
  "seed-event-tomas-figuritas.ts",
  "seed-event-clorindo-ceramica.ts",
  "seed-event-cofijaus-feria-ropa.ts",
  "seed-event-federal-tango.ts",
  "seed-event-federal-vermut-jazz.ts",
  "seed-event-federal-arte-vivo.ts",
  "seed-event-federal-feria.ts",
  "seed-event-blest-after-office.ts",
  "seed-event-blest-dj-set.ts",
  "seed-event-base-attendance.ts",
  "seed-events-belgrano-palermo-batch.ts",
] as const

const scriptsDir = import.meta.dir

function runScript(script: string): void {
  console.log(`\n>>> ${script}`)

  const result = spawnSync(process.execPath, ["run", path.join(scriptsDir, script)], {
    cwd: scriptsDir,
    env: process.env,
    stdio: "inherit",
  })

  if (result.status !== 0) {
    throw new Error(`Falló ${script} (exit ${result.status ?? "unknown"})`)
  }
}

async function main(): Promise<void> {
  if (!process.env.DIRECT_URL?.trim() && !process.env.DATABASE_URL?.trim()) {
    throw new Error("Missing DIRECT_URL o DATABASE_URL")
  }

  console.log("Poblando contenido demo de Nexa…")

  for (const script of SCRIPTS) {
    runScript(script)
  }

  console.log("\n✓ Contenido demo aplicado.")
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
