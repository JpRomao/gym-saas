import { Prisma, Student as PrismaStudent } from '@prisma/client'

import { Student } from '@/domain/gym/enterprise/entities/student'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        phone: raw.phone,
        birthday: raw.birthday,
        cpf: raw.cpf,
        gymId: new UniqueEntityID(raw.gymId),
        planId: new UniqueEntityID(raw.planId),
        address: raw.address,
        hasMedicalRestriction: raw.hasMedicalRestriction,
        gender: raw.gender,
        height: raw.height,
        weight: raw.weight,
        lastPaymentDate: raw.lastPaymentDate,
        medicalRestrictionDescription: raw.medicalRestrictionDescription,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(student: Student): Prisma.StudentUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      phone: student.phone,
      birthday: student.birthday,
      cpf: student.cpf,
      gymId: student.gymId.toString(),
      address: student.address,
      hasMedicalRestriction: student.hasMedicalRestriction,
      planId: student.planId.toString(),
      gender: student.gender,
      height: student.height,
      weight: student.weight,
      lastPaymentDate: student.lastPaymentDate,
      medicalRestrictionDescription: student.medicalRestrictionDescription,
    }
  }
}
