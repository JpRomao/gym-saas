import { Either, left, right } from '@/core/either'
import { AdminAlreadyExistsError } from './errors/admin-already-exists-error'
import { AdminRepository } from '../repositories/admin-repository'
import { Admin } from '../../enterprise/entities/admin'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'

interface RegisterAdminUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterAdminUseCaseResponse = Either<
  AdminAlreadyExistsError,
  {
    admin: Admin
  }
>

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const adminAlreadyExists = await this.adminRepository.findByEmail(email)

    if (adminAlreadyExists) {
      return left(new AdminAlreadyExistsError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const admin = Admin.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.adminRepository.create(admin)

    return right({ admin })
  }
}
