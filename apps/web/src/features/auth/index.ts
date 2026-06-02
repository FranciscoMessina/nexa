export { LoginPage } from "./components/loginPage"
export { RegisterPage } from "./components/registerPage"
export { DashboardPage } from "./components/dashboardPage"
export {
  useRequireAuthentication,
  useRedirectAuthenticatedUser,
} from "./hooks/useAuthRedirect"
export { AuthError, MIN_PASSWORD_LENGTH, getPostLoginPathForRole } from "./constants/auth.constants"
export { authService } from "./services/auth.service"
export type {
  AuthUser,
  LoginPayload,
  SignUpPayload,
  SignUpResult,
  UserRole,
} from "./types/auth.types"
