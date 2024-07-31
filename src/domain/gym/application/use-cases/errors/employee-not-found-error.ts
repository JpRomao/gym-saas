import { UseCaseError } from '@/core/errors/use-case-error'

export class EmployeeNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Employee [${identifier}] not found`)
  }
}
