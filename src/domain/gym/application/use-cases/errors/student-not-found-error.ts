export class StudentNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Student [${identifier}] not found`)
  }
}
