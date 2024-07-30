export class EmployeeNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Employee ${identifier} not found`)
  }
}
