import { useMemo, useState } from "react"
import { IconEye, IconEyeClosed, IconLock, IconMail } from "@tabler/icons-react"
import { Link, useNavigate } from "@tanstack/react-router"
import type { BaseSyntheticEvent } from "react"
import {
  AuthError,
  MIN_PASSWORD_LENGTH,
  getPostLoginPathForRole,
} from "@/features/auth/api/auth.api"
import { useRedirectAuthenticatedUser } from "@/features/auth/hooks/useAuthRedirect"
import { useAuth } from "@/shared/hooks/useAuth"

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isSubmitting } = useAuth()
  useRedirectAuthenticatedUser()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length >= MIN_PASSWORD_LENGTH
  }, [email, password])

  async function handleSubmit(event: BaseSyntheticEvent): Promise<void> {
    event.preventDefault()
    setErrorMessage(null)

    try {
      const loggedUser = await login({ email, password, remember })
      await navigate({ to: getPostLoginPathForRole(loggedUser.role) })
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage(error.message)
        return
      }

      setErrorMessage("No se pudo iniciar sesion. Intenta nuevamente.")
    }
  }

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,#ffe7d9_0%,#f8f9fc_32%,#f6f7fb_100%)] px-4 py-6 sm:px-6 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
        <section className="relative hidden h-full min-h-160 overflow-hidden rounded-[2.25rem] bg-white/80 p-10 shadow-[0_25px_90px_-45px_rgba(30,54,110,0.35)] backdrop-blur lg:flex lg:flex-col">
          <div className="absolute -left-20 -top-20 size-56 rounded-full bg-linear-to-br from-[#ffd2b9] to-[#ffdfcb]" />
          <div className="absolute -bottom-28 -left-14 h-64 w-80 rounded-[50%] bg-linear-to-r from-[#ffc06f] to-[#ff9f5d] opacity-70" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 text-5xl font-black leading-none tracking-tight text-[#092859]">
              <span className="bg-linear-to-r from-[#ffb31a] to-[#ff6b3d] bg-clip-text text-transparent">
                ne
              </span>
              <span>xa</span>
            </div>

            <p className="max-w-sm text-xl font-semibold uppercase tracking-[0.28em] text-[#102e60]">
              Nuevos <span className="text-[#f4a318]">planes</span>.
              <br />
              Nuevas <span className="text-[#ff6f3d]">conexiones</span>.
            </p>

            <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
              <div className="h-28 rounded-3xl bg-linear-to-b from-[#ffc42b] to-[#ffa743]" />
              <div className="h-36 rounded-[2rem] bg-linear-to-b from-[#ff8c3b] to-[#ff6b3d]" />
              <div className="h-24 rounded-3xl bg-linear-to-b from-[#ffd04f] to-[#ffb321]" />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_18px_70px_-45px_rgba(14,33,76,0.5)] backdrop-blur sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-col gap-2 text-center lg:text-left">
            <p className="text-5xl font-black leading-none tracking-tight text-[#092859] lg:hidden">
              nexa
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[#0e2a59]">Iniciar sesion</h1>
            <p className="text-base text-[#66789c]">
              Ingresa tu correo y contrasena para acceder a tu cuenta.
            </p>
          </div>

          <form
            className="space-y-5"
            data-testid="login-form"
            onSubmit={(event) => {
              void handleSubmit(event)
            }}
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1f3660]" htmlFor="email">
                Correo electronico
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-[#d9dfeb] bg-white px-4 py-3 focus-within:border-[#f4a318] focus-within:ring-2 focus-within:ring-[#ffd18a]">
                <IconMail className="text-[#8ea0bf]" size={20} stroke={1.8} />
                <input
                  autoComplete="email"
                  className="w-full border-none bg-transparent text-base text-[#152c55] outline-none placeholder:text-[#9aa8c0]"
                  data-testid="login-email-input"
                  id="email"
                  onChange={(event) => {
                    setEmail(event.target.value)
                  }}
                  placeholder="emprendedor@nexa.mock"
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1f3660]" htmlFor="password">
                Contrasena
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-[#d9dfeb] bg-white px-4 py-3 focus-within:border-[#f4a318] focus-within:ring-2 focus-within:ring-[#ffd18a]">
                <IconLock className="text-[#8ea0bf]" size={20} stroke={1.8} />
                <input
                  autoComplete="current-password"
                  className="w-full border-none bg-transparent text-base text-[#152c55] outline-none placeholder:text-[#9aa8c0]"
                  data-testid="login-password-input"
                  id="password"
                  minLength={MIN_PASSWORD_LENGTH}
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                  placeholder="Ingresa tu contrasena"
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                  className="text-[#8194b3] transition-colors hover:text-[#4f6488]"
                  onClick={() => {
                    setShowPassword((previousState) => !previousState)
                  }}
                  type="button"
                >
                  {showPassword ? <IconEyeClosed size={20} /> : <IconEye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="inline-flex items-center gap-3 text-[#6f7f9b]">
                <input
                  data-testid="login-remember-checkbox"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-[#d9dfeb] text-[#ff6b3d] focus:ring-[#ffd18a]"
                />
                <span className="select-none">Recordarme</span>
              </label>
              <Link className="font-semibold text-[#ff6f3d]" to="/login">
                Olvidaste tu contrasena?
              </Link>
            </div>

            {errorMessage ? (
              <p
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
                data-testid="login-error"
              >
                {errorMessage}
              </p>
            ) : null}

            <button
              className="w-full rounded-xl bg-linear-to-r from-[#f8ba1f] to-[#ff6b3d] px-6 py-3 text-lg font-semibold text-white shadow-[0_14px_30px_-18px_rgba(255,112,50,0.9)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              data-testid="login-submit-button"
              disabled={!canSubmit || isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Ingresando..." : "Iniciar sesion"}
            </button>
          </form>

        </section>
      </div>
    </main>
  )
}
