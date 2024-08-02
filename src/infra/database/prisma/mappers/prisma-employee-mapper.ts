import { Employee as PrismaEmployee, Prisma } from '@prisma/client'

import { Employee } from '@/domain/gym/enterprise/entities/employee'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaEmployeeMapper {
  static toDomain(raw: PrismaEmployee): Employee {
    return Employee.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        phone: raw.phone,
        cpf: raw.cpf,
        gymId: new UniqueEntityID(raw.gymId),
        address: raw.address,
        role: 'WORKER',
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(employee: Employee): Prisma.EmployeeUncheckedCreateInput {
    return {
      id: employee.id.toString(),
      name: employee.name,
      email: employee.email,
      password: employee.password,
      phone: employee.phone,
      cpf: employee.cpf,
      gymId: employee.gymId.toString(),
      address: employee.address,
      role: employee.role,
    }
  }
}
