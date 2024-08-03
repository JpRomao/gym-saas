import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { GymRepository } from '../repositories/gym-repository'
import { PlanRepository } from '../repositories/plan-repository'
import { Plan } from '../../enterprise/entities/plan'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface UpdatePlanRequest {
  discount?: number | null
  duration?: number
  gymId: string
  planId: number
  price?: number
}

type UpdatePlanResponse = Either<
  ResourceNotFoundError | ResourceNotFoundError | PermissionDeniedError,
  {
    plan: Plan
  }
>

@Injectable()
export class UpdatePlanUseCase {
  constructor(
    private planRepository: PlanRepository,
    private gymRepository: GymRepository,
  ) {}

  async execute({
    discount,
    duration,
    gymId,
    price,
    planId,
  }: UpdatePlanRequest): Promise<UpdatePlanResponse> {
    const gym = this.gymRepository.findById(gymId)

    if (!gym) {
      return left(new ResourceNotFoundError('Gym'))
    }

    const plan = await this.planRepository.findById(planId)

    if (!plan) {
      return left(new ResourceNotFoundError('Plan'))
    }

    if (plan.gymId.toString() !== gymId) {
      return left(new PermissionDeniedError())
    }

    plan.discount = discount || plan.discount
    plan.duration = duration || plan.duration
    plan.price = price || plan.price

    await this.planRepository.save(plan)

    return right({ plan })
  }
}
