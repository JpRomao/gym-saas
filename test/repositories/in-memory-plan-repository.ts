import { PlanRepository } from '@/domain/gym/application/repositories/plan-repository'
import { Plan } from '@/domain/gym/enterprise/entities/plan'

export class InMemoryPlanRepository implements PlanRepository {
  public items: Plan[] = []

  async findById(id: number): Promise<Plan | null> {
    return this.items.find((plan) => plan.id.toValue() === id) || null
  }

  async findManyByGymId(gymId: string): Promise<Plan[]> {
    return this.items.filter((plan) => plan.gymId.toString() === gymId)
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

  async delete(plan: Plan): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === plan.id.toString(),
    )

    this.items.splice(index, 1)
  }
}
