import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
  private value: string | number

  toString(): string {
    if (typeof this.value === 'number') {
      return this.value.toString()
    }

    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string | number) {
    this.value = value ?? randomUUID()
  }

  public equals(id: UniqueEntityID) {
    return id.toValue() === this.value
  }
}
