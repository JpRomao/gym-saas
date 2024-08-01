export class CnpjAlreadyBeingUsedError extends Error {
  constructor(cnpj: string) {
    super(`CNPJ ${cnpj} is already being used`)
  }
}
