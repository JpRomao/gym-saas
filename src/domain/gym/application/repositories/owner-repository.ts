import { Owner } from '../../enterprise/entities/owner'

export abstract class OwnerRepository {
  abstract findByEmail(email: string): Promise<Owner | null>
  abstract findById(id: string): Promise<Owner | null>
  abstract create(owner: Owner): Promise<void>
  abstract update(owner: Owner): Promise<void>
}
