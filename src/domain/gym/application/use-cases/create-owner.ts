import { Either, left, right } from '@/core/either'
import { Owner } from '../../enterprise/entities/owner'
import { HashGenerator } from '../cryptography/hash-generator'
import { OwnerRepository } from '../repositories/owner-repository'
import { AdminRepository } from '../repositories/admin-repository'
import { PermissionDeniedError } from './errors/permission-denied-error'

interface CreateOwnerUseCaseRequest {
  name: string
  email: string
  phone: string
  adminId: string
}

type CreateOwnerUseCaseResponse = Either<
  PermissionDeniedError,
  {
    owner: Owner
  }
>

export class CreateOwnerUseCase {
  constructor(
    private ownerRepository: OwnerRepository,
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    phone,
    adminId,
  }: CreateOwnerUseCaseRequest): Promise<CreateOwnerUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId)

    if (!admin) {
      return left(new PermissionDeniedError(adminId))
    }

    const password = 'owner1234!'

    const hashedPassword = await this.hashGenerator.hash(password)

    const owner = Owner.create({
      name,
      email,
      password: hashedPassword,
      phone,
    })

    await this.ownerRepository.create(owner)

    return right({ owner })
  }
}
