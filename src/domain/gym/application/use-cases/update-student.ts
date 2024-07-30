import { Either, left, right } from '@/core/either'
import { Address } from '../../enterprise/entities/gym'
import { StudentRepository } from '../repositories/student-repository'
import { PlanNotFoundError } from './errors/plan-not-found-error'
import { Student } from '../../enterprise/entities/student'
import { StudentNotFoundError } from './errors/student-not-found-error'

interface UpdateStudentUseCaseRequest {
  studentId: string
  name: string
  email: string
  phone: string
  hasMedicalRestriction: boolean
  medicalRestrictionDescription?: string | null
  address: Address
  height: number | null
  weight: number | null
}

type UpdateStudentUseCaseResponse = Either<
  PlanNotFoundError,
  {
    student: Student
  }
>

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
      return left(new StudentNotFoundError(studentId))
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
