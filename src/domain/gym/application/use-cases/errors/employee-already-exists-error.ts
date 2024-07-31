import { UseCaseError } from '@/core/errors/use-case-error'

export class EmployeeAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Employee [${identifier}] already exists`)
  }
}
