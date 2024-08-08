import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { PlanRepository } from '../repositories/plan-repository'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { EmployeeRepository } from '../repositories/employee-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { findManager } from '../utils/find-manager'
import { OwnerRepository } from '../repositories/owner-repository'
import { GymRepository } from '../repositories/gym-repository'

interface DeletePlanUseCaseRequest {
  planId: number
  managerId: string
}

type DeletePlanUseCaseResponse = Either<
  ResourceNotFoundError | PermissionDeniedError,
  null
>

@Injectable()
export class DeletePlanUseCase {
  constructor(
    private planRepository: PlanRepository,
    private employeeRepository: EmployeeRepository,
    private ownerRepository: OwnerRepository,
    private gymRepository: GymRepository,
  ) {}

  async execute({
    planId,
    managerId,
  }: DeletePlanUseCaseRequest): Promise<DeletePlanUseCaseResponse> {
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

    await this.planRepository.delete(plan)

    return right(null)
  }
}
