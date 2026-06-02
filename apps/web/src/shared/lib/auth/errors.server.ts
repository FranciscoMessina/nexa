export class UnauthorizedError extends Error {
  constructor(message = "Tenés que iniciar sesión.") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends Error {
  constructor(message = "No tenés permiso para realizar esta acción.") {
    super(message)
    this.name = "ForbiddenError"
  }
}
