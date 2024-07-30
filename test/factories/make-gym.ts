import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Gym, GymProps } from '@/domain/gym/enterprise/entities/gym'

export function makeGym(override: Partial<GymProps> = {}, id?: UniqueEntityID) {
  const gym = Gym.create(
    {
      address: {
        city: faker.location.city(),
        neighborhood: faker.location.street(),
        number: faker.location.buildingNumber(),
        state: faker.location.state(),
        street: faker.location.street(),
        zipCode: faker.location.zipCode(),
      },
      cnpj: faker.string.numeric(14),
      name: faker.company.name(),
      phone: faker.phone.number(),
      ...override,
    },
    id,
  )

  return gym
}
