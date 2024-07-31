import { AdminRepository } from '@/domain/gym/application/repositories/admin-repository'
import { Admin } from '@/domain/gym/enterprise/entities/admin'

export class InMemoryAdminRepository implements AdminRepository {
  public items: Admin[] = []

  async findByEmail(email: string): Promise<Admin | null> {
    return this.items.find((admin) => admin.email === email) || null
  }

  async create(admin: Admin): Promise<void> {
    this.items.push(admin)
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((admin) => admin.id.toString() !== id)
  }
}
