import { Injectable } from '@nestjs/common'

import { GymRepository } from '@/domain/gym/application/repositories/gym-repository'
import { PrismaService } from '../../prisma.service'
import { Gym } from '@/domain/gym/enterprise/entities/gym'
import { PrismaGymMapper } from '../mappers/prisma-gym-mapper'

@Injectable()
export class PrismaGymRepository implements GymRepository {
  constructor(private prisma: PrismaService) {}

  async findGymById(id: string): Promise<Gym | null> {
    const gym = await this.prisma.gym.findUnique({
      where: {
        id,
      },
    })

    if (!gym) {
      return null
    }

    return PrismaGymMapper.toDomain(gym)
  }

  async findByCnpj(cnpj: string): Promise<Gym | null> {
    const gym = await this.prisma.gym.findUnique({
      where: {
        cnpj,
      },
    })

    if (!gym) {
      return null
    }

    return PrismaGymMapper.toDomain(gym)
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = await this.prisma.gym.findUnique({
      where: {
        id,
      },
    })

    if (!gym) {
      return null
    }

    return PrismaGymMapper.toDomain(gym)
  }

  async create(gym: Gym): Promise<void> {
    const data = PrismaGymMapper.toPrisma(gym)

    await this.prisma.gym.create({
      data,
    })
  }

  async save(gym: Gym): Promise<void> {
    const data = PrismaGymMapper.toPrisma(gym)

    await this.prisma.gym.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
