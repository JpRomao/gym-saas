import { UseCaseError } from '@/core/errors/use-case-error'

export class GymAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Gym [${identifier}] already exists`)
  }
}
