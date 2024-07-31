import { Plan } from '../../enterprise/entities/plan'

export abstract class PlanRepository {
  abstract create(plan: Plan): Promise<void>
  abstract findById(id: string): Promise<Plan | null>
  abstract findManyByGymId(gymId: string): Promise<Plan[]>
  abstract save(plan: Plan): Promise<void>
  abstract delete(plan: Plan): Promise<void>
}
