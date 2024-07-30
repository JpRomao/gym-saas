import { Either, left, right } from '@/core/either'
import { Address, Gym } from '../../enterprise/entities/gym'
import { GymRepository } from '../repositories/gym-repository'
import { GymAlreadyExistsError } from './errors/gym-already-exists-error'

interface CreateGymUseCaseRequest {
  cnpj: string
  name: string
  phone: string
  address: Address
}

type CreateGymUseCaseResponse = Either<
  GymAlreadyExistsError,
  {
    gym: Gym
  }
>

export class CreateGymUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    address,
    cnpj,
    name,
    phone,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gymWithSameCnpj = await this.gymRepository.findByCnpj(cnpj)

    if (gymWithSameCnpj) {
      return left(new GymAlreadyExistsError(cnpj))
    }

    const gym = Gym.create({
      address,
      cnpj,
      name,
      phone,
    })

    await this.gymRepository.create(gym)

    return right({ gym })
  }
}
