import { Plan } from '../../enterprise/entities/plan'

export abstract class PlanRepository {
  abstract create(plan: Plan): Promise<void>
  abstract fetchByGymId(gymId: string): Promise<Plan[]>
  abstract fetchById(id: string): Promise<Plan | null>
  abstract save(plan: Plan): Promise<void>
  abstract delete(id: string): Promise<void>
}
