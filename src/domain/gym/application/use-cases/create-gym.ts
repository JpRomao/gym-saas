import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Gym } from '../../enterprise/entities/gym'
import { GymRepository } from '../repositories/gym-repository'
import { CnpjAlreadyBeingUsedError } from './errors/cnpj-already-being-used-error'
import { OwnerRepository } from '../repositories/owner-repository'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface CreateGymUseCaseRequest {
  cnpj: string
  name: string
  phone: string
  email: string
  latitude: number
  longitude: number
  ownerId: string
}

type CreateGymUseCaseResponse = Either<
  ResourceNotFoundError | CnpjAlreadyBeingUsedError | PermissionDeniedError,
  {
    gym: Gym
  }
>

@Injectable()
export class CreateGymUseCase {
  constructor(
    private gymRepository: GymRepository,
    private ownerRepository: OwnerRepository,
  ) {}

  async execute({
    cnpj,
    name,
    phone,
    email,
    ownerId,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const owner = await this.ownerRepository.findById(ownerId)

    if (!owner) {
      return left(new ResourceNotFoundError())
    }

    const gymWithSameCnpj = await this.gymRepository.findByCnpj(cnpj)

    if (gymWithSameCnpj) {
      return left(new CnpjAlreadyBeingUsedError(cnpj))
    }

    const gym = Gym.create({
      cnpj,
      name,
      phone,
      email,
      latitude,
      longitude,
      lastPaymentDate: null,
      premiumEndsAt: null,
      ownerId: owner.id,
    })

    await this.gymRepository.create(gym)

    return right({ gym })
  }
}
