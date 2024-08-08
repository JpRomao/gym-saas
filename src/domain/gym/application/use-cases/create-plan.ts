import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Plan } from '../../enterprise/entities/plan'
import { PlanRepository } from '../repositories/plan-repository'
import { GymRepository } from '../repositories/gym-repository'
import { EmployeeRepository } from '../repositories/employee-repository'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { OwnerRepository } from '../repositories/owner-repository'
import { Employee } from '../../enterprise/entities/employee'
import { Owner } from '../../enterprise/entities/owner'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreatePlanRequest {
  name: string
  duration: number
  price: number
  discount: number | null
  gymId: string
  managerId: string
}

type CreatePlanResponse = Either<
  ResourceNotFoundError | PermissionDeniedError,
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
    name,
    price,
  }: CreatePlanRequest): Promise<CreatePlanResponse> {
    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      return left(new ResourceNotFoundError())
    }

    let manager: Employee | Owner | null =
      await this.employeeRepository.findById(managerId)

    if (manager && manager.role !== 'MANAGER') {
      return left(new PermissionDeniedError())
    }

    if (!manager) {
      manager = await this.ownerRepository.findById(managerId)

      if (!manager) {
        return left(new ResourceNotFoundError('Manager'))
      }
    }

    if (manager instanceof Employee && manager.gymId !== gym.id) {
      return left(new PermissionDeniedError())
    } else if (manager instanceof Owner && !manager.id.equals(gym.ownerId)) {
      return left(new PermissionDeniedError())
    }

    const plan = Plan.create(
      { discount, duration, gymId: gym.id, name, price },
      new UniqueEntityID('autoIncrement').toNumber(),
    )

    await this.planRepository.create(plan)

    return right({ plan })
  }
}
