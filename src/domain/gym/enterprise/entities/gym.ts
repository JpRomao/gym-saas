import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface GymProps {
  cnpj: string
  name: string
  phone: string
  premiumEndsAt?: Date | null
  email: string
  lastPaymentDate: Date | null
  ownerId: UniqueEntityID
  createdAt: Date
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

  get premiumEndsAt(): Date | null | undefined {
    return this.props.premiumEndsAt
  }

  get email(): string {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get lastPaymentDate(): Date | null {
    return this.props.lastPaymentDate
  }

  get ownerId(): UniqueEntityID {
    return this.props.ownerId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  public static create(
    props: Optional<GymProps, 'createdAt' | 'premiumEndsAt'>,
    id?: UniqueEntityID,
  ): Gym {
    return new Gym(
      {
        ...props,
        premiumEndsAt: null ?? props.premiumEndsAt,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  public deactivatePremium(): void {
    this.props.premiumEndsAt = null
  }

  public activatePremium(): void {
    const nowPlusOneMonth = new Date(
      new Date().setMonth(new Date().getMonth() + 1),
    )

    this.props.premiumEndsAt = nowPlusOneMonth
  }

  public pay(): void {
    this.props.lastPaymentDate = new Date()
  }
}
