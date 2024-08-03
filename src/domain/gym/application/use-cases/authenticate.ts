import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { EmployeeRepository } from '../repositories/employee-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { OwnerRepository } from '../repositories/owner-repository'
import { Employee } from '../../enterprise/entities/employee'
import { Owner } from '../../enterprise/entities/owner'

interface AuthenticateEmployeeUseCaseRequest {
  email: string
  password: string
}

type AuthenticateEmployeeUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

type EmployeeToAuthenticate = Employee | Owner | null

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private ownerRepository: OwnerRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateEmployeeUseCaseRequest): Promise<AuthenticateEmployeeUseCaseResponse> {
    let employeeToAuthenticate: EmployeeToAuthenticate =
      await this.employeeRepository.findByEmail(email)

    if (!employeeToAuthenticate) {
      employeeToAuthenticate = await this.ownerRepository.findByEmail(email)

      if (!employeeToAuthenticate) {
        return left(new WrongCredentialsError())
      }

      if (!employeeToAuthenticate.firstLoginDate) {
        employeeToAuthenticate.setFirstLoginDate()

        await this.ownerRepository.update(employeeToAuthenticate)
      }
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      employeeToAuthenticate.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: employeeToAuthenticate.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
