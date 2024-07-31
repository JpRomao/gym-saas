import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin } from '@/domain/gym/enterprise/entities/admin'
import { faker } from '@faker-js/faker'

export function makeAdmin(override: Partial<Admin> = {}, id?: UniqueEntityID) {
  return Admin.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )
}
