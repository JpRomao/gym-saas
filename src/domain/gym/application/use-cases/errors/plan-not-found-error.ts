export class PlanNotFoundError extends Error {
  constructor(planId: string) {
    super(`Plan with id ${planId} not found`)
  }
}
