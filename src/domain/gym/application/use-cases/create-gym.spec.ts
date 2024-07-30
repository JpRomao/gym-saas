import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { CreateGymUseCase } from './create-gym'
import { GymAlreadyExistsError } from './errors/gym-already-exists-error'
import { makeGym } from 'test/factories/make-gym'

let inMemoryGymsRepository: InMemoryGymRepository

let sut: CreateGymUseCase

describe('Create Gym', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymRepository()

    sut = new CreateGymUseCase(inMemoryGymsRepository)
  })

  it('should be able to create a new Gym', async () => {
    const result = await sut.execute({
      address: {
        city: 'São Paulo',
        neighborhood: 'Vila Mariana',
        number: '123',
        state: 'SP',
        street: 'Rua 1',
        zipCode: '12345678',
      },
      cnpj: '12345678901234',
      name: 'Gym',
      phone: '11999999999',
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
      address: {
        city: 'São Paulo',
        neighborhood: 'Vila Mariana',
        number: '123',
        state: 'SP',
        street: 'Rua 1',
        zipCode: '12345678',
      },
      cnpj: gym.cnpj,
      name: 'Gym',
      phone: '11999999999',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(GymAlreadyExistsError)
  })
})
