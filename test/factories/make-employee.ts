import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Employee,
  EmployeeProps,
} from '@/domain/gym/enterprise/entities/employee'
import { generateAddress } from 'test/utils/generate-address'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma.service'
import { PrismaEmployeeMapper } from '@/infra/database/prisma/mappers/prisma-employee-mapper'

export function makeEmployee(
  override: Partial<EmployeeProps> = {},
  id?: UniqueEntityID,
) {
  const address = generateAddress()

  const employee = Employee.create(
    {
      gymId: new UniqueEntityID(),
      cpf: faker.string.numeric(11),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      role: 'WORKER',
      address,
      ...override,
    },
    id,
  )

  return employee
}
interface MakeEmployeeData {
  gymId: UniqueEntityID
  rest: Partial<EmployeeProps>
}

@Injectable()
export class EmployeeFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaEmployee({
    gymId,
    rest,
  }: MakeEmployeeData): Promise<Employee> {
    const employee = makeEmployee({
      gymId,
      ...rest,
    })

    await this.prisma.employee.create({
      data: PrismaEmployeeMapper.toPrisma(employee),
    })

    return employee
  }
}
