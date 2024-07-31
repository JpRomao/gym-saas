import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Gender, Student } from '../../enterprise/entities/student'
import { PlanRepository } from '../repositories/plan-repository'
import { StudentRepository } from '../repositories/student-repository'
import { PlanNotFoundError } from './errors/plan-not-found-error'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

interface RegisterStudentUsecaseRequest {
  name: string
  email: string
  planId: string
  phone: string
  birthday: Date
  cpf: string
  hasMedicalRestriction: boolean
  medicalRestrictionDescription?: string | null
  address: string
  gender?: Gender
}

type RegisterStudentUsecaseResponse = Either<
  PlanNotFoundError,
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
      return left(new PlanNotFoundError(planId))
    }

    const studentAlreadyRegisteredAtThisGym =
      await this.studentRepository.findByCpfAndGymId(cpf, plan.gymId)

    if (studentAlreadyRegisteredAtThisGym) {
      return left(new StudentAlreadyExistsError(cpf, plan.gymId))
    }

    const student = Student.create({
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
      gymId: plan.gymId,
    })

    await this.studentRepository.create(student)

    return right({ student })
  }
}
