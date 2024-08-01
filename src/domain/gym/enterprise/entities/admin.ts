import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AdminProps {
  name: string
  email: string
  password: string
}

export class Admin extends Entity<AdminProps> {
  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get password(): string {
    return this.props.password
  }

  static create(props: AdminProps, id?: UniqueEntityID): Admin {
    return new Admin(props, id)
  }
}
