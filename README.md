# Nexa

Monorepo de la app Nexa (TanStack Start + Supabase + Drizzle).

## Desarrollo

```bash
bun install
bun run dev
```

La app web corre en `apps/web` (http://localhost:3000).

### Registro de usuarios y confirmación por email

El registro en `/registro` usa **Supabase Auth**. Si el proyecto exige confirmación de email, Supabase envía el correo (no Nexa/Resend).

**Error `email rate limit exceeded`:** el SMTP gratuito de Supabase tiene un límite bajo de envíos por hora. Tras varios intentos de registro, bloquea nuevos correos.

**Para desarrollo local (recomendado):**

1. En [Supabase Dashboard](https://supabase.com/dashboard) → tu proyecto → **Authentication** → **Sign In / Providers** → **Email**
2. Desactivá **Confirm email** (confirmación de email)
3. Guardá los cambios
4. Si ya creaste el usuario sin confirmar: **Authentication** → **Users** → eliminá la fila de `m.n.piquero@hotmail.com` (o el email que usaste)
5. Volvé a registrarte en `/registro` — deberías entrar directo sin esperar correo

**Usuarios de demo** (sin registro): `asistente@nexa.mock` / `NexaDev2024!` (tras `bun run db:seed`).

**Si querés correos reales en producción:** configurá SMTP propio en Supabase (**Project Settings** → **Authentication** → **SMTP Settings**), por ejemplo con Resend, y agregá `http://localhost:3000/**` en **Redirect URLs** (Authentication → URL Configuration).

### Si `bun run dev` falla con `omit.default is not a function`

Es un conflicto entre **Bun** y el plugin de Netlify. En desarrollo local el plugin ya está desactivado por defecto. Si el error persiste:

1. Cerrá otros procesos que usen el puerto 3000.
2. Volvé a ejecutar `bun run dev` desde la raíz del repo.
3. Solo si necesitás emular funciones de Netlify en local: `NETLIFY_DEV=true bun run dev`.

## Base de datos

Variables en `apps/web/.env.local` (ver `apps/web/.env.example`).

```bash
bun run db:migrate
bun run db:seed
```

## Recomendaciones de eventos por email

Nexa puede enviar por email un evento futuro relacionado con la categoría que el usuario más asistió. La lógica prioriza eventos **verificados**, pero también recomienda eventos **comunitarios** si no hay verificados disponibles.

### Variables de entorno

En `apps/web/.env.local`:

```env
APP_URL=http://localhost:3000

# Desarrollo: imprime el email en la terminal
EMAIL_PROVIDER=console
EMAIL_FROM="Nexa <onboarding@resend.dev>"

# Producción / envío real con Resend:
# EMAIL_PROVIDER=resend
# RESEND_API_KEY=re_xxxxxxxx
# EMAIL_FROM="Nexa <notificaciones@tudominio.com>"
```

| Variable | Descripción |
|----------|-------------|
| `APP_URL` | URL pública para links al detalle del evento |
| `EMAIL_PROVIDER` | `console` (dev) o `resend` (envío real) |
| `RESEND_API_KEY` | API key de [Resend](https://resend.com) |
| `EMAIL_FROM` | Remitente. En pruebas: `Nexa <onboarding@resend.dev>` |

### Enviar recomendaciones

```bash
# Un usuario por email
bun run recommendations:send -- --email asistente@nexa.mock

# Todos los usuarios con opt-in activado
bun run recommendations:send
```

Los envíos quedan registrados en `event_recommendation_deliveries` (`sent`, `failed` o `pending`).

### Probar en consola (desarrollo)

1. `EMAIL_PROVIDER=console` en `.env.local`
2. `bun run db:seed` (usuarios demo con `accepts_email_communications = true`)
3. `bun run recommendations:send -- --email asistente@nexa.mock`
4. El contenido del email aparece en la terminal

### Probar envío real con Resend

1. Creá una cuenta en [resend.com](https://resend.com) y generá una API key.
2. En `.env.local`:

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_tu_api_key
EMAIL_FROM="Nexa <onboarding@resend.dev>"
APP_URL=http://localhost:3000
```

3. **Importante:** con el dominio de prueba `onboarding@resend.dev`, Resend solo entrega emails a la **dirección con la que te registraste** en Resend. Para probar:
   - Actualizá el email del usuario de demo en la base (`users.email`) a tu correo real, **o**
   - Usá `--email tu@correo.com` apuntando a un usuario cuyo `users.email` coincida.
4. Si ya enviaste una recomendación antes, borrá la fila correspondiente en `event_recommendation_deliveries` o probá con otro usuario que aún no haya recibido ese evento.
5. Ejecutá:

```bash
bun run recommendations:send -- --email tu@correo.com
```

6. Revisá tu bandeja (y spam). En el dashboard de Resend podés ver el estado del envío.
7. Si falla, el registro queda con `status = failed` y el error en la terminal.

### Producción

- Verificá tu dominio en Resend.
- Cambiá `EMAIL_FROM` a una dirección de ese dominio (ej. `Nexa <notificaciones@tudominio.com>`).
- Configurá las mismas variables en Netlify (o tu hosting).
- Para jobs programados, usá `RECOMMENDATION_EMAIL_CRON_SECRET` con la server function `sendEventRecommendationEmailsFn`.
