import { faker } from '@faker-js/faker'

import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { CreateGymUseCase } from './create-gym'
import { GymAlreadyExistsError } from './errors/gym-already-exists-error'
import { makeGym } from 'test/factories/make-gym'
import { generateAddress } from 'test/utils/generate-address'

let inMemoryGymsRepository: InMemoryGymRepository

let sut: CreateGymUseCase

describe('Create Gym', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymRepository()

    sut = new CreateGymUseCase(inMemoryGymsRepository)
  })

  it('should be able to create a new Gym', async () => {
    const result = await sut.execute({
      address: generateAddress(),
      cnpj: '12345678901234',
      name: 'Gym',
      phone: '11999999999',
      email: faker.internet.email(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      gym: inMemoryGymsRepository.items[0],
    })
  })

  it('should not be able to create a new Gym with an existing CNPJ', async () => {
    const gym = makeGym()

    await inMemoryGymsRepository.create(gym)

    const result = await sut.execute({
      address: generateAddress(),
      cnpj: gym.cnpj,
      name: 'Gym',
      phone: '11999999999',
      email: faker.internet.email(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(GymAlreadyExistsError)
  })
})
