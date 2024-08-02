import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Gym, GymProps } from '@/domain/gym/enterprise/entities/gym'
import { Injectable } from '@nestjs/common'
import { PrismaGymMapper } from '@/infra/database/prisma/mappers/prisma-gym-mapper'
import { PrismaService } from '@/infra/database/prisma.service'

export function makeGym(override: Partial<GymProps> = {}, id?: UniqueEntityID) {
  const gym = Gym.create(
    {
      cnpj: faker.string.numeric(14),
      name: faker.company.name(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      lastPaymentDate: new Date(),
      ownerId: new UniqueEntityID(),
      premiumEndsAt: null,
      ...override,
    },
    id,
  )

  return gym
}

@Injectable()
export class GymFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaGym(data: Partial<GymProps> = {}): Promise<Gym> {
    const gym = makeGym(data)

    await this.prisma.gym.create({
      data: PrismaGymMapper.toPrisma(gym),
    })

    return gym
  }
}
