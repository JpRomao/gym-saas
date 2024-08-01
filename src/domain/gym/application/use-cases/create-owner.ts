import { Either, left, right } from '@/core/either'
import { Owner } from '../../enterprise/entities/owner'
import { HashGenerator } from '../cryptography/hash-generator'
import { GymRepository } from '../repositories/gym-repository'
import { GymNotFoundError } from './errors/gym-not-found-error'
import { OwnerRepository } from '../repositories/owner-repository'

interface CreateOwnerUseCaseRequest {
  name: string
  email: string
  gymId: string
  cpf: string
  phone: string
}

type CreateOwnerUseCaseResponse = Either<
  GymNotFoundError,
  {
    owner: Owner
  }
>

export class CreateOwnerUseCase {
  constructor(
    private ownerRepository: OwnerRepository,
    private gymRepository: GymRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    gymId,
    phone,
  }: CreateOwnerUseCaseRequest): Promise<CreateOwnerUseCaseResponse> {
    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      return left(new GymNotFoundError(gymId))
    }

    const password = 'admin1234!'

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
