import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { ActivateGymPremiumUseCase } from './activate-gym-premium'
import { makeGym } from 'test/factories/make-gym'

let inMemoryGymsRepository: InMemoryGymRepository

let sut: ActivateGymPremiumUseCase

describe('Activate Gym Premium Plan', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymRepository()

    sut = new ActivateGymPremiumUseCase(inMemoryGymsRepository)
  })

  it('should be able to activate a Gym premium plan', async () => {
    const gym = makeGym()

    await inMemoryGymsRepository.create(gym)

    expect(inMemoryGymsRepository.items[0].premiumEndsAt).toBeNull()

    const result = await sut.execute({
      gymId: gym.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      gym: inMemoryGymsRepository.items[0],
    })
    expect(inMemoryGymsRepository.items[0].premiumActivatedAt).not.toBeNull()
  })
})
