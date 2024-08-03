import { Injectable } from '@nestjs/common'

import { OwnerRepository } from '../repositories/owner-repository'
import { Either, left, right } from '@/core/either'
import { OwnerNotFoundError } from './errors/owner-not-found-error'
import { HashGenerator } from '../cryptography/hash-generator'
import { HashComparer } from '../cryptography/hash-comparer'
import { PasswordDoesNotMatchError } from './errors/password-does-not-match-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface ChangeOwnerPasswordRequest {
  email: string
  newPassword: string
  oldPassword: string
}

type ChangeOwnerPasswordResponse = Either<
  OwnerNotFoundError | PasswordDoesNotMatchError,
  null
>

@Injectable()
export class ChangeOwnerPasswordUseCase {
  constructor(
    private ownerRepository: OwnerRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    newPassword,
    oldPassword,
  }: ChangeOwnerPasswordRequest): Promise<ChangeOwnerPasswordResponse> {
    const owner = await this.ownerRepository.findByEmail(email)

    if (!owner) {
      return left(new ResourceNotFoundError())
    }

    const passwordMatch = await this.hashComparer.compare(
      oldPassword,
      owner.password,
    )

    if (!passwordMatch) {
      return left(new PasswordDoesNotMatchError())
    }

    const newHashedPassword = await this.hashGenerator.hash(newPassword)

    owner.changePassword(newHashedPassword)

    await this.ownerRepository.update(owner)

    return right(null)
  }
}
