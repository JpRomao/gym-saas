import { UseCaseError } from '@/core/errors/use-case-error'

export class PermissionDeniedError extends Error implements UseCaseError {
  constructor(identifier: string, message?: string) {
    super(`Permission denied. Identifier: [${identifier}]. ${message}`)
  }
}
