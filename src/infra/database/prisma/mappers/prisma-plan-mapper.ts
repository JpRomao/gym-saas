import { Prisma, Plan as PrismaPlan } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Plan } from '@/domain/gym/enterprise/entities/plan'

export class PrismaPlanMapper {
  static toDomain(raw: PrismaPlan): Plan {
    return Plan.create(
      {
        discount: raw.discount,
        name: raw.name,
        duration: raw.duration,
        gymId: new UniqueEntityID(raw.gymId),
        price: raw.price,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(plan: Plan): Prisma.PlanUncheckedCreateInput {
    return {
      id: Number(plan.id.toValue()),
      duration: plan.duration,
      discount: plan.discount,
      name: plan.name,
      gymId: plan.gymId.toString(),
      price: plan.price,
    }
  }
}
