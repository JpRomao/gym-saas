import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export enum EmployeeRoles {
  OWNER = 'OWNER',
  WORKER = 'WORKER',
  RELATIONED = 'RELATIONED',
}

export interface EmployeeProps {
  gymId: UniqueEntityID
  name: string
  cpf: string
  email: string
  phone: string
  password: string
  role: EmployeeRoles
  address: string
}

export class Employee extends Entity<EmployeeProps> {
  get gymId(): UniqueEntityID {
    return this.props.gymId
  }

  get name(): string {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
  }

  get cpf(): string {
    return this.props.cpf
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

  set password(value: string) {
    this.props.password = value
  }

  get role(): EmployeeRoles {
    return this.props.role
  }

  set role(value: EmployeeRoles) {
    this.props.role = value
  }

  get address(): string {
    return this.props.address
  }

  public static create(props: EmployeeProps, id?: UniqueEntityID): Employee {
    return new Employee(props, id)
  }
}
