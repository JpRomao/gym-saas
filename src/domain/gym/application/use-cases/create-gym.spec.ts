import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { CreateGymUseCase } from './create-gym'
import { makeGym } from 'test/factories/make-gym'
import { CnpjAlreadyBeingUsedError } from './errors/cnpj-already-being-used-error'
import { InMemoryOwnerRepository } from 'test/repositories/in-memory-owner-repository'
import { makeOwner } from 'test/factories/make-owner'
import { OwnerNotFoundError } from './errors/owner-not-found-error'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { PermissionDeniedError } from './errors/permission-denied-error'

let inMemoryGymsRepository: InMemoryGymRepository
let inMemoryOwnerRepository: InMemoryOwnerRepository
let inMemoryAdminRepository: InMemoryAdminRepository

let sut: CreateGymUseCase

describe('Create Gym', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymRepository()
    inMemoryOwnerRepository = new InMemoryOwnerRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()

    sut = new CreateGymUseCase(
      inMemoryGymsRepository,
      inMemoryOwnerRepository,
      inMemoryAdminRepository,
    )
  })

  it('should be able to create a new Gym', async () => {
    const owner = makeOwner()

    inMemoryOwnerRepository.items.push(owner)

    const result = await sut.execute({
      cnpj: '12345678901234',
      name: 'Gym',
      phone: '11999999999',
      email: 'johndoe@email.com',
      ownerId: owner.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      gym: inMemoryGymsRepository.items[0],
    })
  })

  it('should be able to create a new Gym as an Admin', async () => {
    const owner = makeOwner()

    inMemoryOwnerRepository.items.push(owner)

    const admin = makeOwner()

    inMemoryAdminRepository.items.push(admin)

    const result = await sut.execute({
      cnpj: '12345678901234',
      name: 'Gym',
      phone: '11999999999',
      email: 'johndoe@email.com',
      ownerId: owner.id.toString(),
      adminId: admin.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      gym: inMemoryGymsRepository.items[0],
    })
  })

  it('should not be able to create a new Gym with an existing CNPJ', async () => {
    const gym = makeGym()

    inMemoryGymsRepository.items.push(gym)

    const owner = makeOwner()

    inMemoryOwnerRepository.items.push(owner)

    const result = await sut.execute({
      cnpj: gym.cnpj,
      name: 'Gym',
      phone: '11999999999',
      email: 'johndoe@email.com',
      ownerId: owner.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CnpjAlreadyBeingUsedError)
  })

  it('should not be able to create a new Gym with an invalid Owner', async () => {
    const gym = makeGym()

    inMemoryGymsRepository.items.push(gym)

    const result = await sut.execute({
      cnpj: '12345678901234',
      name: 'Gym',
      phone: '11999999999',
      email: 'johndoe@email.com',
      ownerId: 'invalid-owner-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OwnerNotFoundError)
  })

  it('should not be able to create a new Gym with an invalid Admin', async () => {
    const gym = makeGym()

    inMemoryGymsRepository.items.push(gym)

    const owner = makeOwner()

    inMemoryOwnerRepository.items.push(owner)

    const result = await sut.execute({
      cnpj: '12345678901234',
      name: 'Gym',
      phone: '11999999999',
      email: 'johndoe@email.com',
      ownerId: owner.id.toString(),
      adminId: 'invalid-admin-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PermissionDeniedError)
  })
})
