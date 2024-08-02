import { Prisma, Gym as PrismaGym } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Gym } from '@/domain/gym/enterprise/entities/gym'

export class PrismaGymMapper {
  static toDomain(raw: PrismaGym): Gym {
    return Gym.create(
      {
        ownerId: new UniqueEntityID(raw.ownerId),
        name: raw.name,
        phone: raw.phone,
        cnpj: raw.cnpj,
        email: raw.email,
        premiumEndsAt: raw.premiumEndsAt,
        lastPaymentDate: raw.lastPayment,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(gym: Gym): Prisma.GymUncheckedCreateInput {
    return {
      id: gym.id.toString(),
      ownerId: gym.ownerId.toString(),
      name: gym.name,
      phone: gym.phone,
      cnpj: gym.cnpj,
      email: gym.email,
      premiumEndsAt: gym.premiumEndsAt,
      lastPayment: gym.lastPaymentDate,
      createdAt: gym.createdAt,
    }
  }
}
