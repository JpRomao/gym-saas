import { Either, left, right } from '@/core/either'
import { GymRepository } from '../repositories/gym-repository'
import { PlanRepository } from '../repositories/plan-repository'
import { GymNotFoundError } from './errors/gym-not-found-error'
import { Plan } from '../../enterprise/entities/plan'
import { PlanNotFoundError } from './errors/plan-not-found-error'
import { PermissionDeniedError } from './errors/permission-denied-error'

interface UpdatePlanRequest {
  discount?: number | null
  duration?: number
  gymId: string
  planId: string
  price?: number
}

type UpdatePlanResponse = Either<
  GymNotFoundError | PlanNotFoundError | PermissionDeniedError,
  {
    plan: Plan
  }
>

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
      return left(new GymNotFoundError(gymId))
    }

    const plan = await this.planRepository.findById(planId)

    if (!plan) {
      return left(new PlanNotFoundError(planId))
    }

    if (plan.gymId !== gymId) {
      return left(new PermissionDeniedError(planId))
    }

    plan.discount = discount || plan.discount
    plan.duration = duration || plan.duration
    plan.price = price || plan.price

    await this.planRepository.save(plan)

    return right({ plan })
  }
}
