import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Plan } from '../../enterprise/entities/plan'
import { PlanRepository } from '../repositories/plan-repository'
import { GymNotFoundError } from './errors/gym-not-found-error'
import { GymRepository } from '../repositories/gym-repository'
import { EmployeeRepository } from '../repositories/employee-repository'
import { EmployeeNotFoundError } from './errors/employee-not-found-error'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { OwnerRepository } from '../repositories/owner-repository'

interface CreatePlanRequest {
  name: string
  duration: number
  price: number
  discount: number | null
  gymId: string
  managerId?: string
  ownerId?: string
}

type CreatePlanResponse = Either<
  GymNotFoundError,
  {
    plan: Plan
  }
>

@Injectable()
export class CreatePlanUseCase {
  constructor(
    private planRepository: PlanRepository,
    private gymRepository: GymRepository,
    private employeeRepository: EmployeeRepository,
    private ownerRepository: OwnerRepository,
  ) {}

  async execute({
    discount,
    duration,
    gymId,
    managerId,
    ownerId,
    name,
    price,
  }: CreatePlanRequest): Promise<CreatePlanResponse> {
    if (!ownerId && !managerId) {
      return left(
        new PermissionDeniedError(
          'You must be a manager or owner to create a plan',
        ),
      )
    }

    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      return left(new GymNotFoundError(gymId))
    }

    if (ownerId) {
      const owner = await this.ownerRepository.findById(ownerId)

      if (!owner) {
        return left(new GymNotFoundError(ownerId))
      }
    }

    if (managerId) {
      const manager = await this.employeeRepository.findById(managerId)

      if (!manager) {
        return left(new EmployeeNotFoundError(managerId))
      }

      if (manager.gymId.toString() !== gymId) {
        return left(
          new PermissionDeniedError(
            'You must be a manager of this gym to create a plan',
          ),
        )
      }

      if (manager.role !== 'MANAGER') {
        return left(
          new PermissionDeniedError(
            'You must be a manager of this gym to create a plan',
          ),
        )
      }
    }

    const plan = Plan.create({ discount, duration, gymId: gym.id, name, price })

    await this.planRepository.create(plan)

    return right({ plan })
  }
}
