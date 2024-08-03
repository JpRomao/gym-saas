import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { PlanRepository } from '../repositories/plan-repository'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { EmployeeRepository } from '../repositories/employee-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface DeletePlanUseCaseRequest {
  planId: number
  employeeId: string
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
  ) {}

  async execute({
    planId,
    employeeId,
  }: DeletePlanUseCaseRequest): Promise<DeletePlanUseCaseResponse> {
    const plan = await this.planRepository.findById(planId)

    if (!plan) {
      return left(new ResourceNotFoundError('Plan'))
    }

    const employee = this.employeeRepository.findById(employeeId)

    if (!employee) {
      return left(new ResourceNotFoundError('Employee'))
    }

    await this.planRepository.delete(plan)

    return right(null)
  }
}
