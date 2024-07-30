import { Entity } from '@/core/entities/entity'
import { Address } from './gym'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export type Gender = 'MALE' | 'FEMALE'

export interface StudentProps {
  name: string
  email: string
  planId: string
  phone: string
  birthday: Date
  cpf: string
  hasMedicalRestriction: boolean
  medicalRestrictionDescription: string | null
  gender: Gender
  address: Address
  gymId: string
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

  set address(value: Address) {
    this.props.address = value
  }

  get gender() {
    return this.props.gender
  }

  static create(props: StudentProps, id?: UniqueEntityID) {
    return new Student(props, id)
  }
}
