# @workspace/database

Drizzle ORM + PostgreSQL (Supabase). Solo uso en servidor.

## Setup inicial de la base de datos

Seguí estos pasos la primera vez que configures el proyecto (o en un entorno nuevo).

### 1. Proyecto en Supabase

1. Creá un proyecto en [Supabase](https://supabase.com) (o usá uno existente del equipo).
2. En **Project Settings → API**, copiá `SUPABASE_URL` y `SUPABASE_ANON_KEY` (si la app ya usa Auth/Storage).
3. En **Project Settings → Database**, ubicá las connection strings.

### 2. Variables de entorno

En `apps/web/.env.local` (podés basarte en `apps/web/.env.example`), agregá **dos** URLs distintas:

```env
# Queries en runtime (Transaction pooler, puerto 6543)
DATABASE_URL="postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Migraciones, push y Drizzle Studio (conexión directa, puerto 5432)
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[ref].supabase.co:5432/postgres"
```

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | La app (`db` en servidor) — pooler con `?pgbouncer=true` |
| `DIRECT_URL` | `db:migrate`, `db:push`, `db:studio` — conexión directa sin pooler |

**Importante:** sin `DIRECT_URL`, `bun run db:migrate` falla con `url: undefined`. Ambas deben apuntar al mismo proyecto Supabase, solo cambia el host/puerto según el tipo de conexión que indica el dashboard.

**Windows / redes sin IPv6:** el host `db.[ref].supabase.co` (conexión “direct”) a veces solo resuelve a IPv6. Si `db:migrate` se queda en “applying migrations…” o falla con `getaddrinfo ENOTFOUND`, usá en `DIRECT_URL` la connection string **Session pooler** (puerto `5432`, usuario `postgres.[ref]`) del dashboard de Supabase — la misma familia de URL que `DATABASE_URL`, no el host `db.*`.

No commitees `.env.local` (contiene contraseñas).

### 3. Aplicar el esquema por primera vez

Desde la **raíz del monorepo**:

```bash
bun run db:migrate
```

Eso ejecuta, en orden, todos los archivos SQL en `packages/database/drizzle/` que aún no estén aplicados en tu base (ver tabla de migraciones más abajo).

### 4. Verificar

Opcional pero recomendado:

```bash
bun run db:validate   # schema TypeScript vs archivos de migración
bun run db:studio     # explorar tablas en el navegador
```

En Supabase → **Table Editor** deberías ver las tablas `users`, `events`, etc., y los enums `user_role`, `category`, `social_platform` en el esquema `public`.

### 5. Usar la DB en la app

Con `DATABASE_URL` definida, en handlers de servidor:

```ts
import { db, isDatabaseConfigured } from "@/shared/lib/db/server"
```

Si `DATABASE_URL` no está definida, `db` es `null` y `isDatabaseConfigured()` devuelve `false`.

---

## Cómo correr las migraciones

Las migraciones son archivos SQL versionados en `packages/database/drizzle/`. Drizzle Kit los aplica en el orden registrado en `drizzle/meta/_journal.json`.

### Flujo habitual

| Paso | Comando | Cuándo |
|------|---------|--------|
| 1. Cambiar schema | Editás `src/schema/*.ts` | Nueva tabla, columna, enum, etc. |
| 2. Generar SQL | `bun run db:generate` | Después de cada cambio en el schema |
| 3. Revisar | Abrís el `.sql` nuevo en `drizzle/` | Antes de aplicar en shared/staging/prod |
| 4. Aplicar | `bun run db:migrate` | En cada entorno que deba actualizarse |
| 5. Validar | `bun run db:validate` | Opcional; detecta drift entre schema y migraciones |

Todos los comandos se ejecutan desde la **raíz del repo** (`nexa/`). Internamente usan `dotenv` sobre `apps/web/.env.local` y, para migrar, la variable **`DIRECT_URL`**.

### Qué hace `db:migrate`

1. Conecta a Postgres con `DIRECT_URL`.
2. Lee la tabla interna `__drizzle_migrations` (la crea Drizzle si no existe).
3. Ejecuta solo las migraciones que **aún no** figuran como aplicadas, respetando el orden del journal.
4. No vuelve a correr migraciones ya aplicadas (es idempotente por entorno).

Ejemplo en un clone nuevo del repo:

```bash
# 1) Configurás DIRECT_URL y DATABASE_URL en apps/web/.env.local
# 2) Desde la raíz:
bun run db:migrate
```

Si el equipo agrega `0003_*.sql` más adelante, cada desarrollador (y cada deploy) solo corre `db:migrate` otra vez; se aplicará únicamente lo pendiente.

### `db:push` vs `db:migrate`

| Comando | Comportamiento | Cuándo usarlo |
|---------|----------------|---------------|
| `db:migrate` | Aplica el historial SQL en `drizzle/` | **Recomendado** — dev, staging, producción |
| `db:push` | Sincroniza el schema TypeScript directo a la DB, sin historial | Solo pruebas locales rápidas; puede divergir del equipo |

En un proyecto compartido, preferí siempre **generate + migrate**.

### Si cambiás el schema

```bash
# Después de editar src/schema/
bun run db:generate
bun run db:migrate
```

No edites `_journal.json` a mano salvo migraciones SQL custom (como la FK a `auth.users`), documentadas en este README.

### Migraciones incluidas en el repo

| Archivo | Contenido |
|---------|-----------|
| `0000_nervous_argent.sql` | Enums, 8 tablas, FKs internas |
| `0001_users_auth_user_fk.sql` | FK `users.auth_user_id` → `auth.users(id)` |
| `0002_watery_strong_guy.sql` | Quita `linkedin` del enum `social_platform` |

### Errores frecuentes

- **`url: undefined`** — Falta `DIRECT_URL` en `apps/web/.env.local`.
- **Fallo al aplicar `0002`** — Si ya había filas con `platform = 'linkedin'`, borralas o actualizalas antes de migrar.
- **FK a `auth.users`** — La migración `0001` requiere que exista el esquema `auth` de Supabase (proyecto con Auth habilitado).

---

## Comandos (referencia rápida)

```bash
bun run db:generate   # diff schema → nuevo .sql en drizzle/
bun run db:migrate    # aplica migraciones pendientes (DIRECT_URL)
bun run db:push       # sync directo sin historial (solo dev)
bun run db:studio     # UI para ver/editar datos
bun run db:validate   # comprueba migraciones vs schema
```

`db:validate` usa además `packages/database/.env.validate` (URLs de ejemplo locales).

---

## Schema (`src/schema/`)

### Enums Postgres

| Enum | Valores |
|------|---------|
| `user_role` | `asistente`, `organizador`, `emprendedor` |
| `category` | `ropa`, `feria_de_emprendedores`, `arte_y_cultura`, `cine_y_entretenimiento`, `deportes`, `gastronomia`, `musica`, `talleres_y_cursos` |
| `social_platform` | `instagram`, `facebook`, `twitter`, `youtube`, `tiktok`, `pinterest` |

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `users` | Perfil de app; `auth_user_id` único (FK a Supabase Auth vía migración custom) |
| `user_social_links` | Redes del usuario |
| `user_gallery_images` | Galería del perfil |
| `events` | Eventos; `created_by_user_id` → `users` (`ON DELETE restrict`) |
| `event_gallery_images` | Galería del evento |
| `event_entrepreneurs` | M:N emprendedores en evento |
| `event_attendees` | M:N asistentes registrados |
| `event_favorites` | M:N favoritos |

### Roles: auth ↔ perfil (UI)

| `users.role` (DB / auth) | `ProfileKind` (UI) |
|--------------------------|-------------------|
| `asistente` | `usuario` |
| `organizador` | `organizador` |
| `emprendedor` | `emprendimiento` |

Las categorías en UI usan labels en español; en DB se guardan como enum `category` en snake_case. El mapeo queda para la capa de aplicación.

### FK a Supabase Auth

Drizzle **no** declara la referencia a `auth.users` en el ORM. La migración `0001_users_auth_user_fk.sql` agrega:

```sql
ALTER TABLE "users"
  ADD CONSTRAINT "users_auth_user_id_fkey"
  FOREIGN KEY ("auth_user_id")
  REFERENCES auth.users(id)
  ON DELETE CASCADE;
```

---

## Próximos pasos (fuera de este paquete)

- Políticas RLS en Supabase (`auth.uid()` ↔ `users.auth_user_id`)
- Trigger o lógica de app para `events.favorites_count`
- Poblar `users` al registrarse (trigger o handler post-signup)
- Reemplazar mocks en `apps/web` por queries Drizzle
