import { UseCaseError } from '@/core/errors/use-case-error'

export class OwnerNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Owner not found')
  }
}
