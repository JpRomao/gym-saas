import { InMemoryOwnerRepository } from 'test/repositories/in-memory-owner-repository'
import { makeOwner } from 'test/factories/make-owner'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { CreateOwnerUseCase } from './create-owner'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAdmin } from 'test/factories/make-admin'
import { PermissionDeniedError } from './errors/permission-denied-error'

let inMemoryOwnerRepository: InMemoryOwnerRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let fakeHasher: FakeHasher

let sut: CreateOwnerUseCase

describe('Create Owner Use Case', () => {
  beforeEach(() => {
    inMemoryOwnerRepository = new InMemoryOwnerRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHasher()

    sut = new CreateOwnerUseCase(
      inMemoryOwnerRepository,
      inMemoryAdminRepository,
      fakeHasher,
    )
  })

  it('should be able to create a new owner', async () => {
    const admin = makeAdmin()

    await inMemoryAdminRepository.create(admin)

    const owner = makeOwner()

    const response = await sut.execute({
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      adminId: admin.id.toString(),
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      owner: inMemoryOwnerRepository.items[0],
    })
  })

  it('should not be able to create a new owner with a non-existing admin', async () => {
    const owner = makeOwner()

    const response = await sut.execute({
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      adminId: 'non-existing-admin-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(PermissionDeniedError)
  })
})
