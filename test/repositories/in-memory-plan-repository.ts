import { PlanRepository } from '@/domain/gym/application/repositories/plan-repository'
import { Plan } from '@/domain/gym/enterprise/entities/plan'

export class InMemoryPlanRepository implements PlanRepository {
  public items: Plan[] = []

  async findById(id: string): Promise<Plan | null> {
    return this.items.find((plan) => plan.id.toString() === id) || null
  }

  async findManyByGymId(gymId: string): Promise<Plan[]> {
    return this.items.filter((plan) => plan.gymId === gymId)
  }

  async create(plan: Plan): Promise<void> {
    this.items.push(plan)
  }

  async save(plan: Plan): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === plan.id.toString(),
    )

    this.items[index] = plan
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id)

    this.items.splice(index, 1)
  }
}
