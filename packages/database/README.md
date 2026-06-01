# @workspace/database

Prisma + PostgreSQL (Supabase). Solo uso en servidor.

## Variables

Definí `DATABASE_URL` y `DIRECT_URL` en `apps/web/.env.local` (ver `apps/web/.env.example`).

Los scripts `db:migrate`, `db:push` y `db:studio` cargan ese archivo vía `dotenv-cli`. `db:validate` usa `.env.validate` (placeholders locales).

## Comandos (desde la raíz del monorepo)

```bash
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:studio
```

## Uso en apps/web

```ts
import { prisma, isDatabaseConfigured } from "@/shared/lib/prisma/server"
```

Importá Prisma solo desde handlers servidor (`.server.ts`, `*.functions.ts`).
