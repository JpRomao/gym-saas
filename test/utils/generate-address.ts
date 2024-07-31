import { faker } from '@faker-js/faker'

import { Address } from '@/domain/gym/enterprise/entities/gym'

export function generateAddress(): Address {
  return {
    city: faker.location.city(),
    neighborhood: faker.location.street(),
    number: faker.location.buildingNumber(),
    state: faker.location.state(),
    street: faker.location.street(),
    zipCode: faker.location.zipCode(),
  }
}