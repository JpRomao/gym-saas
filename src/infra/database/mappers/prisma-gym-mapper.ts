import { Prisma, Gym as PrismaGym } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Gym } from '@/domain/gym/enterprise/entities/gym'

export class PrismaGymMapper {
  static toDomain(raw: PrismaGym): Gym {
    return Gym.create(
      {
        address: raw.address,
        name: raw.name,
        phone: raw.phone,
        cnpj: raw.cnpj,
        premiumEndsAt: raw.premiumEndsAt,
        email: raw.email,
        lastPaymentDate: raw.lastPayment,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(gym: Gym): Prisma.GymUncheckedCreateInput {
    return {
      id: gym.id.toString(),
      address: gym.address,
      name: gym.name,
      phone: gym.phone,
      cnpj: gym.cnpj,
      premiumEndsAt: gym.premiumEndsAt,
      email: gym.email,
      lastPayment: gym.lastPaymentDate,
    }
  }
}
