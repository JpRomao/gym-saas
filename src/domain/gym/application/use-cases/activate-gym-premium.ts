import { Either, left, right } from '@/core/either'
import { GymNotFoundError } from './errors/gym-not-found-error'
import { Gym } from '../../enterprise/entities/gym'
import { GymRepository } from '../repositories/gym-repository'

interface ActivateGymPremiumUseCaseRequest {
  gymId: string
}

type ActivateGymPremiumUseCaseResponse = Either<
  GymNotFoundError,
  {
    gym: Gym
  }
>

export class ActivateGymPremiumUseCase {
  constructor(private readonly gymsRepository: GymRepository) {}

  async execute({
    gymId,
  }: ActivateGymPremiumUseCaseRequest): Promise<ActivateGymPremiumUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      return left(new GymNotFoundError(gymId))
    }

    gym.activatePremium()

    await this.gymsRepository.save(gym)

    return right({
      gym,
    })
  }
}
