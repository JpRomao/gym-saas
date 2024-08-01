import { OwnerRepository } from '@/domain/gym/application/repositories/owner-repository'
import { Owner } from '@/domain/gym/enterprise/entities/owner'

export class InMemoryOwnerRepository implements OwnerRepository {
  public items: Owner[] = []

  async findByEmail(email: string): Promise<Owner | null> {
    const owner = this.items.find((owner) => owner.email === email)

    if (!owner) {
      return null
    }

    return owner
  }

  async findById(id: string): Promise<Owner | null> {
    const owner = this.items.find((owner) => owner.id.toString() === id)

    if (!owner) {
      return null
    }

    return owner
  }

  async create(owner: Owner): Promise<void> {
    this.items.push(owner)
  }

  async update(owner: Owner): Promise<void> {
    const index = this.items.findIndex((item) => item.id === owner.id)

    this.items[index] = owner
  }
}
