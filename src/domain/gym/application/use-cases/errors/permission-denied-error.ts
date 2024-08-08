import { UseCaseError } from '@/core/errors/use-case-error'

export class PermissionDeniedError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(`Permission denied. ${message || ''}`.trim())
  }
}
