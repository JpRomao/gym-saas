import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Employee,
  EmployeeProps,
  EmployeeRole,
} from '@/domain/gym/enterprise/entities/employee'

export function makeEmployee(
  override: Partial<EmployeeProps> = {},
  id?: UniqueEntityID,
) {
  const employee = Employee.create(
    {
      gymId: new UniqueEntityID(),
      cpf: faker.string.numeric(11),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      role: EmployeeRole.WORKER,
      ...override,
    },
    id,
  )

  return employee
}
