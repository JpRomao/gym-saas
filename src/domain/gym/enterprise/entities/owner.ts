import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface OwnerProps {
  name: string
  email: string
  phone: string
  password: string
  firstLoginDate?: Date | null
}

export class Owner extends Entity<OwnerProps> {
  get name(): string {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
  }

  get email(): string {
    return this.props.email
  }

  set email(value: string) {
    this.props.email = value
  }

  get phone(): string {
    return this.props.phone
  }

  set phone(value: string) {
    this.props.phone = value
  }

  get password(): string {
    return this.props.password
  }

  get firstLoginDate(): Date | null | undefined {
    return this.props.firstLoginDate
  }

  public static create(props: OwnerProps, id?: UniqueEntityID): Owner {
    return new Owner(props, id)
  }

  public changePassword(newPassword: string): void {
    this.props.password = newPassword
  }

  public setFirstLoginDate(): void {
    this.props.firstLoginDate = new Date()
  }
}
