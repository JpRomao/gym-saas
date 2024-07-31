import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Gym } from '../../enterprise/entities/gym'
import { GymNotFoundError } from './errors/gym-not-found-error'
import { GymRepository } from '../repositories/gym-repository'
import { EmployeeRepository } from '../repositories/employee-repository'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { EmployeeNotFoundError } from './errors/employee-not-found-error'

interface UpdateGymUseCaseRequest {
  gymId: string
  employeeId: string
  name?: string
  cnpj?: string
  phone?: string
  address?: string
  email?: string
}

type UpdateGymUseCaseResponse = Either<
  GymNotFoundError,
  {
    gym: Gym
  }
>

@Injectable()
export class UpdateGymUseCase {
  constructor(
    private gymRepository: GymRepository,
    private employeeRepository: EmployeeRepository,
  ) {}

  async execute({
    address,
    cnpj,
    gymId,
    employeeId,
    name,
    phone,
    email,
  }: UpdateGymUseCaseRequest): Promise<UpdateGymUseCaseResponse> {
    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      return left(new GymNotFoundError(gymId))
    }

    const employee = await this.employeeRepository.findById(employeeId)

    if (!employee) {
      return left(new EmployeeNotFoundError(employeeId))
    }

    if (employee.gymId !== gym.id) {
      return left(
        new PermissionDeniedError(
          employeeId,
          `${employee.name} does not works at this gym. GYM_ID: ${gym.id}`,
        ),
      )
    }

    if (employee.role !== 'ADMIN') {
      return left(
        new PermissionDeniedError(
          employeeId,
          `${employee.name} does not have permission to update this gym ${gym.id}`,
        ),
      )
    }

    gym.email = email || gym.email
    gym.name = name || gym.name
    gym.cnpj = cnpj || gym.cnpj
    gym.phone = phone || gym.phone
    gym.address = address || gym.address

    await this.gymRepository.save(gym)

    return right({
      gym,
    })
  }
}
