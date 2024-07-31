import { Either, left, right } from '@/core/either'
import { AdminAlreadyExistsError } from './errors/admin-already-exists-error'
import { AdminRepository } from '../repositories/admin-repository'
import { Admin } from '../../enterprise/entities/admin'

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

export class RegisterAdminUseCase {
  constructor(private adminRepository: AdminRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const adminAlreadyExists = await this.adminRepository.findByEmail(email)

    if (adminAlreadyExists) {
      return left(new AdminAlreadyExistsError())
    }

    const admin = Admin.create({
      name,
      email,
      password,
    })

    await this.adminRepository.create(admin)

    return right({ admin })
  }
}
