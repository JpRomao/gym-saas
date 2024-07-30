import { UseCaseError } from '@/core/errors/use-case-error'

export class GymNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Gym [${identifier}] not found`)
  }
}
