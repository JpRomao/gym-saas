import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { GymRepository } from '../repositories/gym-repository'
import { PlanRepository } from '../repositories/plan-repository'
import { Plan } from '../../enterprise/entities/plan'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EmployeeRepository } from '../repositories/employee-repository'
import { OwnerRepository } from '../repositories/owner-repository'
import { findManager } from '../utils/find-manager'
import { Owner } from '../../enterprise/entities/owner'
import { Employee } from '../../enterprise/entities/employee'

interface UpdatePlanRequest {
  discount?: number | null
  duration?: number
  planId: number
  price?: number
  managerId: string
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
    private employeeRepository: EmployeeRepository,
    private ownerRepository: OwnerRepository,
  ) {}

  async execute({
    discount,
    duration,
    price,
    planId,
    managerId,
  }: UpdatePlanRequest): Promise<UpdatePlanResponse> {
    const plan = await this.planRepository.findById(planId)

    if (!plan) {
      return left(new ResourceNotFoundError('Plan'))
    }

    const gym = await this.gymRepository.findById(plan.gymId.toString())

    if (!gym) {
      return left(new ResourceNotFoundError('Gym'))
    }

    const manager = await findManager(
      managerId,
      this.employeeRepository,
      this.ownerRepository,
    )

    if (!manager) {
      return left(new ResourceNotFoundError('Manager'))
    }

    if (manager instanceof PermissionDeniedError) {
      return left(manager)
    }

    if (
      manager instanceof Owner &&
      manager.id.toString() !== gym.ownerId.toString()
    ) {
      return left(new PermissionDeniedError())
    }

    if (manager instanceof Employee && !manager.gymId.equals(plan.gymId)) {
      return left(new PermissionDeniedError())
    }

    plan.discount = discount || plan.discount
    plan.duration = duration || plan.duration
    plan.price = price || plan.price

    await this.planRepository.save(plan)

    return right({ plan })
  }
}
