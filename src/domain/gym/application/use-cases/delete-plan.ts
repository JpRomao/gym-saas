import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { PlanRepository } from '../repositories/plan-repository'
import { PlanNotFoundError } from './errors/plan-not-found-error'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { EmployeeRepository } from '../repositories/employee-repository'
import { EmployeeNotFoundError } from './errors/employee-not-found-error'

interface DeletePlanUseCaseRequest {
  planId: number
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
    planId,
    employeeId,
  }: DeletePlanUseCaseRequest): Promise<DeletePlanUseCaseResponse> {
    const plan = await this.planRepository.findById(planId)

    if (!plan) {
      return left(new PlanNotFoundError(planId.toString()))
    }

    const employee = this.employeeRepository.findById(employeeId)

    if (!employee) {
      return left(new EmployeeNotFoundError(employeeId))
    }

    await this.planRepository.delete(plan)

    return right(null)
  }
}
