import { useMemo, useState } from "react"
import {
  IconEye,
  IconEyeClosed,
  IconLock,
  IconMail,
  IconUser,
} from "@tabler/icons-react"
import { Link, useNavigate } from "@tanstack/react-router"
import type { BaseSyntheticEvent } from "react"
import {
  AuthError,
  MIN_PASSWORD_LENGTH,
  ROLE_OPTIONS,
  getPostLoginPathForRole,
} from "@/features/auth/constants/auth.constants"
import { useRedirectAuthenticatedUser } from "@/features/auth/hooks/useAuthRedirect"
import type { UserRole } from "@/features/auth/types/auth.types"
import { NEXA_LOGO_SRC, NexaLogo } from "@/shared/components/nexa-logo"
import { useAuth } from "@/shared/hooks/useAuth"
import { cn } from "@workspace/ui/lib/utils"

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, isSubmitting } = useAuth()
  useRedirectAuthenticatedUser()

  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<UserRole>("asistente")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const passwordsMatch = password === confirmPassword

  const canSubmit = useMemo(() => {
    return (
      displayName.trim().length > 0 &&
      email.trim().length > 0 &&
      password.trim().length >= MIN_PASSWORD_LENGTH &&
      confirmPassword.trim().length >= MIN_PASSWORD_LENGTH &&
      passwordsMatch
    )
  }, [confirmPassword, displayName, email, password, passwordsMatch])

  async function handleSubmit(event: BaseSyntheticEvent): Promise<void> {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!passwordsMatch) {
      setErrorMessage("Las contraseñas no coinciden.")
      return
    }

    try {
      const result = await register({
        email,
        password,
        displayName: displayName.trim(),
        role,
        remember,
      })

      if (result.status === "email_confirmation") {
        setSuccessMessage(
          `Te enviamos un correo a ${result.email} para confirmar tu cuenta. Revisá tu bandeja y luego iniciá sesión.`
        )
        return
      }

      await navigate({ to: getPostLoginPathForRole(result.user.role) })
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage(error.message)
        return
      }

      setErrorMessage("No se pudo crear la cuenta. Intentá nuevamente.")
    }
  }

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,#ffe7d9_0%,#f8f9fc_32%,#f6f7fb_100%)] px-4 py-6 sm:px-6 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
        <section className="relative hidden h-full min-h-160 overflow-hidden rounded-[2.25rem] bg-white/80 p-10 shadow-[0_25px_90px_-45px_rgba(30,54,110,0.35)] backdrop-blur lg:flex lg:flex-col">
          <div className="absolute -top-20 -left-20 size-56 rounded-full bg-linear-to-br from-[#ffd2b9] to-[#ffdfcb]" />
          <div className="absolute -bottom-28 -left-14 h-64 w-80 rounded-[50%] bg-linear-to-r from-[#ffc06f] to-[#ff9f5d] opacity-70" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center">
            <img
              alt="nexa - Nuevos planes. Nuevas conexiones."
              className={cn("h-auto w-full")}
              data-testid="nexa-logo"
              src={NEXA_LOGO_SRC}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_18px_70px_-45px_rgba(14,33,76,0.5)] backdrop-blur sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-col gap-2 text-center lg:text-left">
            <NexaLogo className="mx-auto max-w-44 lg:hidden" variant="full" />
            <h1 className="text-4xl font-bold tracking-tight text-[#0e2a59]">
              Crear cuenta
            </h1>
            <p className="text-base text-[#66789c]">
              Elegí tu rol, completá tus datos y empezá a usar Nexa.
            </p>
          </div>

          <form
            className="space-y-5"
            data-testid="register-form"
            onSubmit={(event) => {
              void handleSubmit(event)
            }}
          >
            <div className="space-y-2">
              <span className="text-sm font-semibold text-[#1f3660]">Tipo de cuenta</span>
              <div className="grid gap-2 sm:grid-cols-3">
                {ROLE_OPTIONS.map((option) => (
                  <label
                    className={cn(
                      "cursor-pointer rounded-xl border px-3 py-3 text-left transition",
                      role === option.value
                        ? "border-[#f4a318] bg-[#fff8ef] ring-2 ring-[#ffd18a]"
                        : "border-[#d9dfeb] bg-white hover:border-[#c5d0e6]"
                    )}
                    key={option.value}
                  >
                    <input
                      checked={role === option.value}
                      className="sr-only"
                      name="role"
                      onChange={() => {
                        setRole(option.value)
                      }}
                      type="radio"
                      value={option.value}
                    />
                    <span className="block text-sm font-semibold text-[#152c55]">
                      {option.label}
                    </span>
                    <span className="mt-1 block text-xs text-[#6f7f9b]">
                      {option.description}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1f3660]" htmlFor="displayName">
                Nombre para mostrar
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-[#d9dfeb] bg-white px-4 py-3 focus-within:border-[#f4a318] focus-within:ring-2 focus-within:ring-[#ffd18a]">
                <IconUser className="text-[#8ea0bf]" size={20} stroke={1.8} />
                <input
                  autoComplete="name"
                  className="w-full border-none bg-transparent text-base text-[#152c55] outline-none placeholder:text-[#9aa8c0]"
                  data-testid="register-display-name-input"
                  id="displayName"
                  onChange={(event) => {
                    setDisplayName(event.target.value)
                  }}
                  placeholder="María López"
                  type="text"
                  value={displayName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1f3660]" htmlFor="email">
                Correo electrónico
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-[#d9dfeb] bg-white px-4 py-3 focus-within:border-[#f4a318] focus-within:ring-2 focus-within:ring-[#ffd18a]">
                <IconMail className="text-[#8ea0bf]" size={20} stroke={1.8} />
                <input
                  autoComplete="email"
                  className="w-full border-none bg-transparent text-base text-[#152c55] outline-none placeholder:text-[#9aa8c0]"
                  data-testid="register-email-input"
                  id="email"
                  onChange={(event) => {
                    setEmail(event.target.value)
                  }}
                  placeholder="tu@email.com"
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1f3660]" htmlFor="password">
                Contraseña
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-[#d9dfeb] bg-white px-4 py-3 focus-within:border-[#f4a318] focus-within:ring-2 focus-within:ring-[#ffd18a]">
                <IconLock className="text-[#8ea0bf]" size={20} stroke={1.8} />
                <input
                  autoComplete="new-password"
                  className="w-full border-none bg-transparent text-base text-[#152c55] outline-none placeholder:text-[#9aa8c0]"
                  data-testid="register-password-input"
                  id="password"
                  minLength={MIN_PASSWORD_LENGTH}
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                  placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
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

            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-[#1f3660]"
                htmlFor="confirmPassword"
              >
                Confirmar contraseña
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-[#d9dfeb] bg-white px-4 py-3 focus-within:border-[#f4a318] focus-within:ring-2 focus-within:ring-[#ffd18a]">
                <IconLock className="text-[#8ea0bf]" size={20} stroke={1.8} />
                <input
                  autoComplete="new-password"
                  className="w-full border-none bg-transparent text-base text-[#152c55] outline-none placeholder:text-[#9aa8c0]"
                  data-testid="register-confirm-password-input"
                  id="confirmPassword"
                  minLength={MIN_PASSWORD_LENGTH}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value)
                  }}
                  placeholder="Repetí tu contraseña"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                />
              </div>
              {confirmPassword.length > 0 && !passwordsMatch ? (
                <p className="text-xs text-red-600">Las contraseñas no coinciden.</p>
              ) : null}
            </div>

            <label className="inline-flex items-center gap-3 text-sm text-[#6f7f9b]">
              <input
                checked={remember}
                className="h-4 w-4 rounded border-[#d9dfeb] text-[#ff6b3d] focus:ring-[#ffd18a]"
                data-testid="register-remember-checkbox"
                onChange={(event) => {
                  setRemember(event.target.checked)
                }}
                type="checkbox"
              />
              <span className="select-none">Recordarme</span>
            </label>

            {errorMessage ? (
              <p
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
                data-testid="register-error"
              >
                {errorMessage}
              </p>
            ) : null}

            {successMessage ? (
              <p
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
                data-testid="register-success"
              >
                {successMessage}
              </p>
            ) : null}

            <button
              className="w-full rounded-xl bg-linear-to-r from-[#f8ba1f] to-[#ff6b3d] px-6 py-3 text-lg font-semibold text-white shadow-[0_14px_30px_-18px_rgba(255,112,50,0.9)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              data-testid="register-submit-button"
              disabled={!canSubmit || isSubmitting || Boolean(successMessage)}
              type="submit"
            >
              {isSubmitting ? "Creando cuenta..." : "Registrarme"}
            </button>

            <p className="text-center text-sm text-[#6f7f9b]">
              ¿Ya tenés cuenta?{" "}
              <Link className="font-semibold text-[#ff6f3d]" to="/login">
                Iniciá sesión
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  )
}
