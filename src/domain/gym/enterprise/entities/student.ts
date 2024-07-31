import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface StudentProps {
  name: string
  email: string
  planId: UniqueEntityID
  phone: string
  birthday: Date
  cpf: string
  hasMedicalRestriction: boolean
  medicalRestrictionDescription: string | null
  gender: string | null
  address: string
  gymId: UniqueEntityID
  weight: number | null
  height: number | null
  lastPaymentDate: Date | null
}

export class Student extends Entity<StudentProps> {
  get name() {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
  }

  get email() {
    return this.props.email
  }

  set email(value: string) {
    this.props.email = value
  }

  get planId() {
    return this.props.planId
  }

  get phone() {
    return this.props.phone
  }

  set phone(value: string) {
    this.props.phone = value
  }

  get birthday() {
    return this.props.birthday
  }

  get cpf() {
    return this.props.cpf
  }

  get hasMedicalRestriction() {
    return this.props.hasMedicalRestriction
  }

  set hasMedicalRestriction(value: boolean) {
    this.props.hasMedicalRestriction = value
  }

  get medicalRestrictionDescription() {
    return this.props.medicalRestrictionDescription
  }

  set medicalRestrictionDescription(value: string | null) {
    this.props.medicalRestrictionDescription = value
  }

  get address() {
    return this.props.address
  }

  set address(value: string) {
    this.props.address = value
  }

  get gender() {
    return this.props.gender
  }

  get gymId() {
    return this.props.gymId
  }

  get weight() {
    return this.props.weight
  }

  set weight(value: number | null) {
    this.props.weight = value
  }

  get height() {
    return this.props.height
  }

  set height(value: number | null) {
    this.props.height = value
  }

  get lastPaymentDate() {
    return this.props.lastPaymentDate
  }

  set lastPaymentDate(value: Date | null) {
    this.props.lastPaymentDate = value
  }

  static create(
    props: Optional<
      StudentProps,
      'weight' | 'height' | 'medicalRestrictionDescription' | 'lastPaymentDate'
    >,
    id?: UniqueEntityID,
  ) {
    return new Student(
      {
        ...props,
        weight: props.weight ?? null,
        height: props.height ?? null,
        medicalRestrictionDescription:
          props.medicalRestrictionDescription ?? null,
        lastPaymentDate: props.lastPaymentDate ?? null,
      },
      id,
    )
  }
}
