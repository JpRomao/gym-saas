export class EmployeeAlreadyExistsError extends Error {
  constructor(identifier: string) {
    super(`Employee [${identifier}] already exists`)
  }
}
