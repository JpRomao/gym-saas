import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { PlanRepository } from '../repositories/plan-repository'
import { PlanNotFoundError } from './errors/plan-not-found-error'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { EmployeeRepository } from '../repositories/employee-repository'
import { EmployeeNotFoundError } from './errors/employee-not-found-error'

interface DeletePlanUseCaseRequest {
  gymId: string
  planId: string
  employeeId: string
}

type DeletePlanUseCaseResponse = Either<
  PlanNotFoundError | PermissionDeniedError,
  null
>

@Injectable()
export class DeletePlanUseCase {
  constructor(
    private planRepository: PlanRepository,
    private employeeRepository: EmployeeRepository,
  ) {}

  async execute({
    gymId,
    planId,
    employeeId,
  }: DeletePlanUseCaseRequest): Promise<DeletePlanUseCaseResponse> {
    const plan = await this.planRepository.findById(planId)

    if (!plan) {
      return left(new PlanNotFoundError(planId))
    }

    if (plan.gymId !== gymId) {
      return left(
        new PermissionDeniedError(employeeId, `Tried to delete plan ${planId}`),
      )
    }

    const employee = this.employeeRepository.findById(employeeId)

    if (!employee) {
      return left(new EmployeeNotFoundError(employeeId))
    }

    await this.planRepository.delete(planId)

    return right(null)
  }
}
