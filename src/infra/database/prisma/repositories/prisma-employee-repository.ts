import { Injectable } from '@nestjs/common'

import { EmployeeRepository } from '@/domain/gym/application/repositories/employee-repository'
import { Employee } from '@/domain/gym/enterprise/entities/employee'
import { PrismaService } from '../../prisma.service'
import { PrismaEmployeeMapper } from '../mappers/prisma-employee-mapper'

@Injectable()
export class PrismaEmployeeRepository implements EmployeeRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Employee | null> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        email,
      },
    })

    if (!employee) {
      return null
    }

    return PrismaEmployeeMapper.toDomain(employee)
  }

  async findByCpf(cpf: string): Promise<Employee | null> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        cpf,
      },
    })

    if (!employee) {
      return null
    }

    return PrismaEmployeeMapper.toDomain(employee)
  }

  async findById(id: string): Promise<Employee | null> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id,
      },
    })

    if (!employee) {
      return null
    }

    return PrismaEmployeeMapper.toDomain(employee)
  }

  async create(employee: Employee): Promise<void> {
    const data = PrismaEmployeeMapper.toPrisma(employee)

    await this.prisma.employee.create({
      data,
    })
  }

  async save(employee: Employee): Promise<void> {
    const data = PrismaEmployeeMapper.toPrisma(employee)

    await this.prisma.employee.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
