import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { FindGymByCnpjUseCase } from './find-gym-by-cnpj'
import { GymNotFoundError } from './errors/gym-not-found-error'
import { makeGym } from 'test/factories/make-gym'

let inMemoryGymsRepository: InMemoryGymRepository

let sut: FindGymByCnpjUseCase

describe('Find Gym by cnpj', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymRepository()

    sut = new FindGymByCnpjUseCase(inMemoryGymsRepository)
  })

  it('should be able to find a gym with a cnpj', async () => {
    const gym = makeGym()

    await inMemoryGymsRepository.create(gym)

    const result = await sut.execute({
      cnpj: gym.cnpj,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      gym: inMemoryGymsRepository.items[0],
    })
  })

  it('should not be able to find a gym with an invalid cnpj', async () => {
    const gym = makeGym()

    await inMemoryGymsRepository.create(gym)

    const result = await sut.execute({
      cnpj: '12345678901236',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(GymNotFoundError)
  })
})
