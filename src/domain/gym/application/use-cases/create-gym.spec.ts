import { faker } from '@faker-js/faker'

import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { CreateGymUseCase } from './create-gym'
import { makeGym } from 'test/factories/make-gym'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { CnpjAlreadyBeingUsedError } from './errors/cnpj-already-being-used-error'

let inMemoryGymsRepository: InMemoryGymRepository
let inMemoryAdminRepository: InMemoryAdminRepository

let sut: CreateGymUseCase

describe('Create Gym', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()

    sut = new CreateGymUseCase(inMemoryGymsRepository, inMemoryAdminRepository)
  })

  it('should be able to create a new Gym', async () => {
    const admin = makeAdmin()

    inMemoryAdminRepository.items.push(admin)

    const result = await sut.execute({
      cnpj: '12345678901234',
      name: 'Gym',
      phone: '11999999999',
      email: faker.internet.email(),
      adminId: admin.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      gym: inMemoryGymsRepository.items[0],
    })
  })

  it('should not be able to create a new Gym with an existing CNPJ', async () => {
    const admin = makeAdmin()

    inMemoryAdminRepository.items.push(admin)

    const gym = makeGym()

    await inMemoryGymsRepository.create(gym)

    const result = await sut.execute({
      cnpj: gym.cnpj,
      name: 'Gym',
      phone: '11999999999',
      email: faker.internet.email(),
      adminId: admin.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CnpjAlreadyBeingUsedError)
  })

  it('should not be able to create a new Gym with an invalid Admin', async () => {
    const result = await sut.execute({
      cnpj: '12345678901234',
      name: 'Gym',
      phone: '11999999999',
      email: faker.internet.email(),
      adminId: 'invalid-admin-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PermissionDeniedError)
  })
})
