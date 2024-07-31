import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Gym, GymProps } from '@/domain/gym/enterprise/entities/gym'
import { generateAddress } from 'test/utils/generate-address'

export function makeGym(override: Partial<GymProps> = {}, id?: UniqueEntityID) {
  const gym = Gym.create(
    {
      address: generateAddress(),
      cnpj: faker.string.numeric(14),
      name: faker.company.name(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      lastPaymentDate: new Date(),
      ...override,
    },
    id,
  )

  return gym
}
