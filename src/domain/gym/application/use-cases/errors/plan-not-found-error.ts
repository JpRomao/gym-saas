import { UseCaseError } from '@/core/errors/use-case-error'

export class PlanNotFoundError extends Error implements UseCaseError {
  constructor(planId: string) {
    super(`Plan with id ${planId} not found`)
  }
}
