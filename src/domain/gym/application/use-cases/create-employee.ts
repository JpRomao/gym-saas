import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Employee, EmployeeRoles } from '../../enterprise/entities/employee'
import { EmployeeRepository } from '../repositories/employee-repository'
import { GymRepository } from '../repositories/gym-repository'
import { GymNotFoundError } from './errors/gym-not-found-error'
import { EmployeeAlreadyExistsError } from './errors/employee-already-exists-error'
import { HashGenerator } from '../cryptography/hash-generator'

interface CreateEmployeeUseCaseRequest {
  name: string
  cpf: string
  email: string
  password: string
  phone: string
  role: EmployeeRoles
  gymId: string
  address: string
}

type CreateEmployeeUseCaseResponse = Either<
  GymNotFoundError | EmployeeAlreadyExistsError,
  {
    employee: Employee
  }
>

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private gymRepository: GymRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    role,
    gymId,
    cpf,
    phone,
    address,
  }: CreateEmployeeUseCaseRequest): Promise<CreateEmployeeUseCaseResponse> {
    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      return left(new GymNotFoundError(gymId))
    }

    const employeeWithSameEmail =
      await this.employeeRepository.findByEmail(email)

    if (employeeWithSameEmail) {
      return left(new EmployeeAlreadyExistsError(email))
    }

    const employeeWithSameCpf = await this.employeeRepository.findByCpf(cpf)

    if (employeeWithSameCpf) {
      return left(new EmployeeAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const employee = Employee.create({
      name,
      email,
      password: hashedPassword,
      role,
      gymId: gym.id,
      cpf,
      phone,
      address,
    })

    await this.employeeRepository.create(employee)

    return right({ employee })
  }
}
