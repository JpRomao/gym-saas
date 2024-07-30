import { Gym } from '../../enterprise/entities/gym'

export abstract class GymRepository {
  abstract create(gym: Gym): Promise<void>
  abstract findByCnpj(cnpj: string): Promise<Gym | null>
  abstract findById(id: string): Promise<Gym | null>
  abstract save(gym: Gym): Promise<void>
}
