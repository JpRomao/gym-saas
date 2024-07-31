import { Injectable } from '@nestjs/common'

import { StudentRepository } from '@/domain/gym/application/repositories/student-repository'
import { Student } from '@/domain/gym/enterprise/entities/student'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class PrismaStudentRepository implements StudentRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Student | null> {
    const student = await this.prisma.student.findUnique({
      where: {
        id,
      },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }

  async findByCpfAndGymId(cpf: string, gymId: string): Promise<Student | null> {
    const student = await this.prisma.student.findFirst({
      where: {
        cpf,
        gymId,
      },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)

    await this.prisma.student.create({
      data,
    })
  }

  async save(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)

    await this.prisma.student.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
