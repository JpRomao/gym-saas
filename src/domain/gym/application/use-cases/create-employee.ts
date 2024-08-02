import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Employee, EmployeeRoles } from '../../enterprise/entities/employee'
import { EmployeeRepository } from '../repositories/employee-repository'
import { GymRepository } from '../repositories/gym-repository'
import { GymNotFoundError } from './errors/gym-not-found-error'
import { EmployeeAlreadyExistsError } from './errors/employee-already-exists-error'
import { HashGenerator } from '../cryptography/hash-generator'
import { OwnerRepository } from '../repositories/owner-repository'
import { Owner } from '../../enterprise/entities/owner'
import { EmployeeNotFoundError } from './errors/employee-not-found-error'
import { PermissionDeniedError } from './errors/permission-denied-error'

interface CreateEmployeeUseCaseRequest {
  name: string
  cpf: string
  email: string
  password: string
  phone: string
  role: EmployeeRoles
  gymId: string
  address: string
  ownerId?: string
  employeeId?: string
}

type CreateEmployeeUseCaseResponse = Either<
  GymNotFoundError | EmployeeAlreadyExistsError | PermissionDeniedError,
  {
    employee: Employee
  }
>

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private gymRepository: GymRepository,
    private OwnerRepository: OwnerRepository,
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
    ownerId,
    employeeId,
  }: CreateEmployeeUseCaseRequest): Promise<CreateEmployeeUseCaseResponse> {
    let manager: Owner | Employee | null = null

    if (ownerId) {
      const owner = await this.OwnerRepository.findById(ownerId)

      if (!owner) {
        return left(new PermissionDeniedError())
      }

      manager = owner
    }

    if (employeeId && !manager) {
      const employee = await this.employeeRepository.findById(employeeId)

      if (!employee) {
        return left(new EmployeeNotFoundError(employeeId))
      }

      if (employee.role !== 'MANAGER') {
        return left(new PermissionDeniedError())
      }

      manager = employee
    }

    if (!manager) {
      return left(new PermissionDeniedError())
    }

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
