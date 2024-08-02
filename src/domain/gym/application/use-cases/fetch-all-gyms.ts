import { Injectable } from '@nestjs/common'
import { GymRepository } from '../repositories/gym-repository'
import { Gym } from '../../enterprise/entities/gym'
import { Either, left, right } from '@/core/either'
import { AdminRepository } from '../repositories/admin-repository'
import { PermissionDeniedError } from './errors/permission-denied-error'

interface FetchAllGymsUseCaseRequest {
  page: number
  adminId: string
}

type FetchAllGymsUseCaseResponse = Either<
  PermissionDeniedError,
  { gyms: Gym[] }
>

@Injectable()
export class FetchAllGymsUseCase {
  constructor(
    private gymRepository: GymRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    page,
    adminId,
  }: FetchAllGymsUseCaseRequest): Promise<FetchAllGymsUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId)

    if (!admin) {
      return left(new PermissionDeniedError())
    }

    const gyms = await this.gymRepository.findMany({ page })

    return right({ gyms })
  }
}
