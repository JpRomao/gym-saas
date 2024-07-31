import { Admin } from '../../enterprise/entities/admin'

export abstract class AdminRepository {
  abstract create(admin: Admin): Promise<void>
  abstract findByEmail(email: string): Promise<Admin | null>
  // abstract delete(admin: Admin): Promise<void>
}
