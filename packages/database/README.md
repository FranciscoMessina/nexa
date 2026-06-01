# @workspace/database

Drizzle ORM + PostgreSQL (Supabase). Solo uso en servidor.

## Variables

Definí `DATABASE_URL` y `DIRECT_URL` en `apps/web/.env.local` (ver `apps/web/.env.example`).

- `DATABASE_URL`: transaction pooler (puerto 6543, `?pgbouncer=true`) para queries en runtime.
- `DIRECT_URL`: conexión directa (puerto 5432) para migraciones, push y studio.

Los scripts `db:generate`, `db:migrate`, `db:push` y `db:studio` cargan ese archivo vía `dotenv-cli`. `db:validate` usa `.env.validate` (placeholders locales).

## Comandos (desde la raíz del monorepo)

```bash
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:studio
```

## Uso en apps/web

```ts
import { db, isDatabaseConfigured } from "@/shared/lib/db/server"
```

Importá Drizzle solo desde handlers servidor (`.server.ts`, `*.functions.ts`). Si `DATABASE_URL` no está definida, `db` es `null` y `isDatabaseConfigured()` devuelve `false`.

## Schema

Definí tablas en `src/schema/` y corré `bun run db:generate` + `bun run db:migrate` (o `db:push` en desarrollo).
