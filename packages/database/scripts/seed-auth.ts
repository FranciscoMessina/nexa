import type postgres from "postgres"
import type { userRoleEnum } from "../src/schema/enums"

type DbRole = (typeof userRoleEnum.enumValues)[number]

export const SEED_DEV_PASSWORD = "nexaseed"

export type SeedAuthUserInput = {
  id: string
  email: string
  displayName: string
  role: DbRole
  /** Usuarios con login de demo: fila en `auth.identities` + metadata para la app. */
  canSignIn: boolean
}

const LOGIN_EMAILS = [
  "asistente@nexa.mock",
  "organizador@nexa.mock",
  "emprendedor@nexa.mock",
] as const

async function resolveAuthInstanceId(sql: postgres.Sql): Promise<string> {
  const rows = await sql<{ instance_id: string }[]>`
    SELECT instance_id::text
    FROM auth.users
    LIMIT 1
  `

  return rows[0]?.instance_id ?? "00000000-0000-0000-0000-000000000000"
}

export async function cleanupSeedAuthUsers(
  sql: postgres.Sql,
  authUserIds: Array<string>
): Promise<void> {
  if (authUserIds.length === 0) {
    return
  }

  await sql`
    DELETE FROM auth.identities
    WHERE user_id = ANY(${sql.array(authUserIds)}::uuid[])
  `

  await sql`
    DELETE FROM auth.users
    WHERE id = ANY(${sql.array(authUserIds)}::uuid[])
       OR email = ANY(${sql.array([...LOGIN_EMAILS])})
       OR email LIKE '%@seed.nexa.mock'
  `
}

export async function insertSeedAuthUsers(
  sql: postgres.Sql,
  authUsers: Array<SeedAuthUserInput>
): Promise<void> {
  if (authUsers.length === 0) {
    return
  }

  const instanceId = await resolveAuthInstanceId(sql)

  for (const authUser of authUsers) {
    const metadata = JSON.stringify({
      role: authUser.role,
      displayName: authUser.displayName,
      display_name: authUser.displayName,
    })

    // GoTrue scans token columns as string; NULL provoca "Database error querying schema".
    await sql`
      INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        email_change_token_current,
        phone_change,
        phone_change_token,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
      )
      VALUES (
        ${authUser.id}::uuid,
        ${instanceId}::uuid,
        'authenticated',
        'authenticated',
        ${authUser.email},
        crypt(${SEED_DEV_PASSWORD}, gen_salt('bf')),
        NOW(),
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '{"provider":"email","providers":["email"]}'::jsonb,
        ${metadata}::jsonb,
        NOW(),
        NOW()
      )
    `

    if (authUser.canSignIn) {
      const identityData = JSON.stringify({
        sub: authUser.id,
        email: authUser.email,
      })

      await sql`
        INSERT INTO auth.identities (
          id,
          user_id,
          identity_data,
          provider,
          provider_id,
          last_sign_in_at,
          created_at,
          updated_at
        )
        VALUES (
          ${authUser.id}::uuid,
          ${authUser.id}::uuid,
          ${identityData}::jsonb,
          'email',
          ${authUser.id},
          NOW(),
          NOW(),
          NOW()
        )
      `
    }
  }
}
