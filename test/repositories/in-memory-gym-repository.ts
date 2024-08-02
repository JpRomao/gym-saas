import { PaginationParams } from '@/core/repositories/pagination-params'
import { GymRepository } from '@/domain/gym/application/repositories/gym-repository'
import { Gym } from '@/domain/gym/enterprise/entities/gym'

export class InMemoryGymRepository implements GymRepository {
  public items: Gym[] = []

  async findByCnpj(cnpj: string): Promise<Gym | null> {
    const gym = this.items.find((gym) => gym.cnpj === cnpj)

    if (!gym) {
      return null
    }

    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((gym) => gym.id.toString() === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async findMany({ page }: PaginationParams): Promise<Gym[]> {
    const gyms = this.items
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return gyms
  }

  async create(gym: Gym): Promise<void> {
    this.items.push(gym)
  }

  async save(gym: Gym): Promise<void> {
    const index = this.items.findIndex((g) => g.id === gym.id)

    this.items[index] = gym
  }
}
