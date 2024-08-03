import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Gym } from '../../enterprise/entities/gym'
import { GymRepository } from '../repositories/gym-repository'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface UpdateGymUseCaseRequest {
  gymId: string
  ownerId: string
  name?: string
  cnpj?: string
  phone?: string
  email?: string
}

type UpdateGymUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    gym: Gym
  }
>

@Injectable()
export class UpdateGymUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    cnpj,
    gymId,
    ownerId,
    name,
    phone,
    email,
  }: UpdateGymUseCaseRequest): Promise<UpdateGymUseCaseResponse> {
    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      return left(new ResourceNotFoundError('Gym'))
    }

    if (gym.ownerId.toString() !== ownerId) {
      return left(new PermissionDeniedError())
    }

    gym.email = email || gym.email
    gym.name = name || gym.name
    gym.cnpj = cnpj || gym.cnpj
    gym.phone = phone || gym.phone

    await this.gymRepository.save(gym)

    return right({
      gym,
    })
  }
}
