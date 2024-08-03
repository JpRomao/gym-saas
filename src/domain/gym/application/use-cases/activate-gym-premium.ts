import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Gym } from '../../enterprise/entities/gym'
import { GymRepository } from '../repositories/gym-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface ActivateGymPremiumUseCaseRequest {
  gymId: string
}

type ActivateGymPremiumUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    gym: Gym
  }
>

@Injectable()
export class ActivateGymPremiumUseCase {
  constructor(private gymsRepository: GymRepository) {}

  async execute({
    gymId,
  }: ActivateGymPremiumUseCaseRequest): Promise<ActivateGymPremiumUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      return left(new ResourceNotFoundError(gymId))
    }

    gym.activatePremium()

    await this.gymsRepository.save(gym)

    return right({
      gym,
    })
  }
}
