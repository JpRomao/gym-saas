import { Injectable } from '@nestjs/common'

import { GymRepository } from '@/domain/gym/application/repositories/gym-repository'
import { Gym } from '@/domain/gym/enterprise/entities/gym'
import { PrismaGymMapper } from '../mappers/prisma-gym-mapper'
import { PrismaService } from '../../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaGymRepository implements GymRepository {
  constructor(private prisma: PrismaService) {}

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

  async findMany({ page, take = 20 }: PaginationParams): Promise<Gym[]> {
    const gyms = await this.prisma.gym.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip: (page - 1) * take,
    })

    return gyms.map(PrismaGymMapper.toDomain)
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
