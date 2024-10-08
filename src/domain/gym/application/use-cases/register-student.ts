import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Student } from '../../enterprise/entities/student'
import { PlanRepository } from '../repositories/plan-repository'
import { StudentRepository } from '../repositories/student-repository'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface RegisterStudentUsecaseRequest {
  name: string
  email: string
  planId: number
  phone: string
  birthday: Date
  cpf: string
  hasMedicalRestriction: boolean
  medicalRestrictionDescription?: string | null
  address: string
  gender: string | null
}

type RegisterStudentUsecaseResponse = Either<
  ResourceNotFoundError,
  {
    student: Student
  }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentRepository: StudentRepository,
    private planRepository: PlanRepository,
  ) {}

  async execute({
    address,
    birthday,
    cpf,
    email,
    hasMedicalRestriction,
    name,
    phone,
    planId,
    medicalRestrictionDescription,
    gender,
  }: RegisterStudentUsecaseRequest): Promise<RegisterStudentUsecaseResponse> {
    const plan = await this.planRepository.findById(planId)

    if (!plan) {
      return left(new ResourceNotFoundError('Plan'))
    }

    const studentAlreadyRegisteredAtThisGym =
      await this.studentRepository.findByCpfAndGymId(cpf, plan.gymId.toString())

    if (studentAlreadyRegisteredAtThisGym) {
      return left(new StudentAlreadyExistsError(cpf, plan.gymId.toString()))
    }

    const student = Student.create({
      address,
      birthday,
      cpf,
      email,
      hasMedicalRestriction,
      name,
      phone,
      planId: plan.id,
      medicalRestrictionDescription,
      gender,
      gymId: plan.gymId,
    })

    await this.studentRepository.create(student)

    return right({ student })
  }
}
