import { Injectable } from '@nestjs/common'

import { PlanRepository } from '@/domain/gym/application/repositories/plan-repository'
import { Plan } from '@/domain/gym/enterprise/entities/plan'
import { PrismaPlanMapper } from '../mappers/prisma-plan-mapper'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class PrismaPlanRepository implements PlanRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Plan | null> {
    const plan = await this.prisma.plan.findUnique({
      where: {
        id,
      },
    })

    if (!plan) {
      return null
    }

    return PrismaPlanMapper.toDomain(plan)
  }

  async findManyByGymId(gymId: string): Promise<Plan[]> {
    const plans = await this.prisma.plan.findMany({
      where: {
        gymId,
      },
    })

    return plans.map((plan) => PrismaPlanMapper.toDomain(plan))
  }

  async create(plan: Plan): Promise<void> {
    const data = PrismaPlanMapper.toPrisma(plan)

    await this.prisma.plan.create({
      data,
    })
  }

  async save(plan: Plan): Promise<void> {
    const data = PrismaPlanMapper.toPrisma(plan)

    await this.prisma.plan.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(plan: Plan): Promise<void> {
    const data = PrismaPlanMapper.toPrisma(plan)

    await this.prisma.plan.delete({
      where: {
        id: data.id,
      },
    })
  }
}
