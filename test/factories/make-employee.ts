import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Employee,
  EmployeeProps,
} from '@/domain/gym/enterprise/entities/employee'
import { generateAddress } from 'test/utils/generate-address'

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
