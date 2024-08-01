import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Gym } from '../../enterprise/entities/gym'
import { GymRepository } from '../repositories/gym-repository'
import { GymAlreadyExistsError } from './errors/gym-already-exists-error'
import { AdminRepository } from '../repositories/admin-repository'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { CnpjAlreadyBeingUsedError } from './errors/cnpj-already-being-used-error'

interface CreateGymUseCaseRequest {
  cnpj: string
  name: string
  phone: string
  email: string
  adminId: string
}

type CreateGymUseCaseResponse = Either<
  GymAlreadyExistsError,
  {
    gym: Gym
  }
>

@Injectable()
export class CreateGymUseCase {
  constructor(
    private gymRepository: GymRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    cnpj,
    name,
    phone,
    email,
    adminId,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId)

    if (!admin) {
      return left(new PermissionDeniedError(adminId))
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
      lastPaymentDate: null,
      premiumEndsAt: null,
    })

    await this.gymRepository.create(gym)

    return right({ gym })
  }
}
