import { Either, left, right } from '@/core/either'
import { EmployeeRepository } from '../repositories/employee-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

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

export class AuthenticateEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateEmployeeUseCaseRequest): Promise<AuthenticateEmployeeUseCaseResponse> {
    const employee = await this.employeeRepository.findByEmail(email)

    if (!employee) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      employee.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: employee.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
