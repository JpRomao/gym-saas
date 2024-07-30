export class PermissionDeniedError extends Error {
  constructor(identifier: string, message?: string) {
    super(`Permission denied. Identifier: ${identifier}. ${message}`)
  }
}
