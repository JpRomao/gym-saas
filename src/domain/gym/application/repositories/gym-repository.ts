import { PaginationParams } from '@/core/repositories/pagination-params'
import { Gym } from '../../enterprise/entities/gym'

export abstract class GymRepository {
  abstract findById(id: string): Promise<Gym | null>
  abstract findByCnpj(cnpj: string): Promise<Gym | null>
  abstract findMany(params: PaginationParams): Promise<Gym[]>
  abstract create(gym: Gym): Promise<void>
  abstract save(gym: Gym): Promise<void>
}
