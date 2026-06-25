import type { AppUserRow } from "@/features/auth/api/users.server"

/** Eventos verificados grandes (ferias, noches de música en bares). */
const LARGE_VERIFIED_EVENT_BASE_ATTENDANCE = new Map<string, number>([
  ["d6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a", 30], // Feria de ropa Cofi Jaus
  ["e7f8a9b0-c1d2-4e3f-4a5b-6c7d8e9f0a1b", 28], // DJ set Blest
  ["e4f5a6b7-c8d9-4e0f-1a2b-3c4d5e6f7a8b", 26], // Show de tango Federal
])

/** Eventos verificados medianos. */
const MEDIUM_VERIFIED_EVENT_BASE_ATTENDANCE = new Map<string, number>([
  ["f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c", 22], // After office Blest
  ["f5a6b7c8-d9e0-4f1a-2b3c-4d5e6f7a8b9c", 20], // Taller cerámica Clorindo
])

/** Eventos comunitarios (encuentros chicos). */
const COMMUNITY_EVENT_BASE_ATTENDANCE = new Map<string, number>([
  ["c7d8e9f0-a1b2-4c3d-9e0f-1a2b3c4d5e6f", 12], // Yoga Plaza Francia
  ["d1e2f3a4-b5c6-4d7e-8f9a-0b1c2d3e4f5a", 11], // Poesía Clorindo
  ["f3a4b5c6-d7e8-4f9a-0b1c-2d3e4f5a6b7c", 14], // Running Costanera
  ["b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e", 13], // Intercambio idiomas
  ["a4b8c2d1-6e3f-4a91-9b2c-1f0e8d7c6b5a", 10], // Figuritas Mundial
])

export const DEMO_EVENT_BASE_ATTENDANCE: ReadonlyMap<string, number> = new Map([
  ...LARGE_VERIFIED_EVENT_BASE_ATTENDANCE,
  ...MEDIUM_VERIFIED_EVENT_BASE_ATTENDANCE,
  ...COMMUNITY_EVENT_BASE_ATTENDANCE,
])

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function resolveBaseAttendanceCountForNewEvent(user: AppUserRow): number {
  if (user.role === "organizador" && user.validatedAt) {
    return randomInRange(18, 26)
  }

  return randomInRange(10, 14)
}

export function resolveDisplayedAttendanceCount(
  baseAttendanceCount: number,
  registeredAttendeeCount: number
): number {
  return baseAttendanceCount + registeredAttendeeCount
}
