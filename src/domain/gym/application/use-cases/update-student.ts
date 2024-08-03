import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { StudentRepository } from '../repositories/student-repository'
import { Student } from '../../enterprise/entities/student'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface UpdateStudentUseCaseRequest {
  studentId: string
  name: string
  email: string
  phone: string
  hasMedicalRestriction: boolean
  medicalRestrictionDescription?: string | null
  address: string
  height: number | null
  weight: number | null
}

type UpdateStudentUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    student: Student
  }
>

@Injectable()
export class UpdateStudentUseCase {
  constructor(private studentRepository: StudentRepository) {}

  async execute({
    studentId,
    address,
    email,
    hasMedicalRestriction,
    name,
    phone,
    medicalRestrictionDescription,
    height,
    weight,
  }: UpdateStudentUseCaseRequest): Promise<UpdateStudentUseCaseResponse> {
    const student = await this.studentRepository.findById(studentId)

    if (!student) {
      return left(new ResourceNotFoundError('Student'))
    }

    student.name = name || student.name
    student.email = email || student.email
    student.height = height || student.height
    student.weight = weight || student.weight
    student.address = address || student.address
    student.phone = phone || student.phone
    student.hasMedicalRestriction =
      hasMedicalRestriction || student.hasMedicalRestriction
    student.medicalRestrictionDescription =
      medicalRestrictionDescription || student.medicalRestrictionDescription

    await this.studentRepository.save(student)

    return right({ student })
  }
}
