import { randomUUID, UUID } from 'node:crypto'

type UniqueEntityIDValue = UUID | number | 'autoIncrement'

export class UniqueEntityID {
  private value: string | number | undefined

  toString(): string {
    if (typeof this.value === 'number') {
      return this.value.toString()
    }

    return this.value as string
  }

  toNumber(): number {
    if (typeof this.value === 'number') {
      return this.value
    }

    return parseInt(this.value as string)
  }

  toValue() {
    return this.value
  }

  constructor(value?: UniqueEntityIDValue, lastValue?: number) {
    if (value === 'autoIncrement') {
      this.value = undefined

      if (lastValue) {
        this.value = lastValue + 1
      }

      return
    }

    this.value = value ?? randomUUID()
  }

  public equals(id: UniqueEntityID) {
    return id.toValue() === this.value
  }
}
