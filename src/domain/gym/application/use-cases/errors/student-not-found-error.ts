import { UseCaseError } from '@/core/errors/use-case-error'

export class StudentNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Student [${identifier}] not found`)
  }
}
