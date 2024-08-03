import { UseCaseError } from '@/core/errors/use-case-error'

export class PasswordDoesNotMatchError extends Error implements UseCaseError {
  constructor() {
    super(`Password does not match`)
  }
}
