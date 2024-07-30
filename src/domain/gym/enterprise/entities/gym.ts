import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface Address {
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface GymProps {
  cnpj: string
  name: string
  phone: string
  premiumActivatedAt?: Date | null
  address: Address
}

export class Gym extends Entity<GymProps> {
  get cnpj(): string {
    return this.props.cnpj
  }

  set cnpj(cnpj: string) {
    this.props.cnpj = cnpj
  }

  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get phone(): string {
    return this.props.phone
  }

  set phone(phone: string) {
    this.props.phone = phone
  }

  get premiumActivatedAt(): Date | null | undefined {
    return this.props.premiumActivatedAt
  }

  get address(): Address {
    return this.props.address
  }

  set address(address: Address) {
    this.props.address = address
  }

  public static create(props: GymProps, id?: UniqueEntityID): Gym {
    return new Gym(
      {
        ...props,
        premiumActivatedAt: null,
      },
      id,
    )
  }

  public deactivatePremium(): void {
    this.props.premiumActivatedAt = null
  }

  public activatePremium(): void {
    this.props.premiumActivatedAt = new Date()
  }
}
