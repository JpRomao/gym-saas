import { InMemoryOwnerRepository } from 'test/repositories/in-memory-owner-repository'
import { ChangeOwnerPasswordUseCase } from './change-owner-password'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeOwner } from 'test/factories/make-owner'
import { PasswordDoesNotMatchError } from './errors/password-does-not-match-error'

let inMemoryOwnerRepository: InMemoryOwnerRepository
let fakeHasher: FakeHasher

let sut: ChangeOwnerPasswordUseCase

describe('Change Owner Password Use Case', () => {
  beforeEach(() => {
    inMemoryOwnerRepository = new InMemoryOwnerRepository()
    fakeHasher = new FakeHasher()

    sut = new ChangeOwnerPasswordUseCase(
      inMemoryOwnerRepository,
      fakeHasher,
      fakeHasher,
    )
  })

  it('should be able to change the owner password', async () => {
    const owner = makeOwner({
      password: await fakeHasher.hash('old-password'),
    })

    inMemoryOwnerRepository.items.push(owner)

    const result = await sut.execute({
      email: owner.email,
      newPassword: 'new-password',
      oldPassword: 'old-password',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to change the owner password if the old password is wrong', async () => {
    const owner = makeOwner()

    inMemoryOwnerRepository.items.push(owner)

    const result = await sut.execute({
      email: owner.email,
      newPassword: 'new-password',
      oldPassword: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PasswordDoesNotMatchError)
  })
})
