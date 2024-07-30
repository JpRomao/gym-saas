import { Either, left, right } from '@/core/either'
import { GymRepository } from '../repositories/gym-repository'
import { GymNotFoundError } from './errors/gym-not-found-error'
import { Gym } from '../../enterprise/entities/gym'

interface FindGymByCnpjUseCaseRequest {
  cnpj: string
}

type FindGymByCnpjUseCaseResponse = Either<GymNotFoundError, { gym: Gym }>

export class FindGymByCnpjUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    cnpj,
  }: FindGymByCnpjUseCaseRequest): Promise<FindGymByCnpjUseCaseResponse> {
    const gym = await this.gymRepository.findByCnpj(cnpj)

    if (!gym) {
      return left(new GymNotFoundError(cnpj))
    }

    return right({ gym })
  }
}
