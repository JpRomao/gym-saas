import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { GymRepository } from '../repositories/gym-repository'
import { Gym } from '../../enterprise/entities/gym'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface FindGymByCnpjUseCaseRequest {
  cnpj: string
}

type FindGymByCnpjUseCaseResponse = Either<ResourceNotFoundError, { gym: Gym }>

@Injectable()
export class FindGymByCnpjUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    cnpj,
  }: FindGymByCnpjUseCaseRequest): Promise<FindGymByCnpjUseCaseResponse> {
    const gym = await this.gymRepository.findByCnpj(cnpj)

    if (!gym) {
      return left(new ResourceNotFoundError(cnpj))
    }

    return right({ gym })
  }
}
