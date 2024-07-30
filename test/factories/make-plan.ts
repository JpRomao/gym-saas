import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Plan, PlanProps } from '@/domain/gym/enterprise/entities/plan'

export function makePlan(
  override: Partial<PlanProps> = {},
  id?: UniqueEntityID,
) {
  const plan = Plan.create(
    {
      discount: faker.number.int({ min: 0, max: 100 }),
      duration: faker.number.int(30),
      gymId: new UniqueEntityID().toString(),
      price: faker.number.int({
        min: 10000, // R$ 100,00
        max: 100000, // R$ 1.000,00
      }),
      name: faker.commerce.productName(),
      ...override,
    },
    id,
  )

  return plan
}
