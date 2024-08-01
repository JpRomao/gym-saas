import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { makeGym } from 'test/factories/make-gym'
import { UpdateGymUseCase } from './update-gym'

let inMemoryGymsRepository: InMemoryGymRepository

let sut: UpdateGymUseCase

describe('Update Gym', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymRepository()

    sut = new UpdateGymUseCase(inMemoryGymsRepository)
  })

  it('should be able to update a gym', async () => {
    const gym = makeGym()

    inMemoryGymsRepository.items.push(gym)

    const result = await sut.execute({
      cnpj: gym.cnpj,
      name: 'New Gym Name',
      phone: '99999999999',
      gymId: gym.id.toString(),
      ownerId: gym.ownerId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryGymsRepository.items[0].name).toEqual('New Gym Name')
    expect(inMemoryGymsRepository.items[0].phone).toEqual('99999999999')
    expect(inMemoryGymsRepository.items[0].email).toEqual(gym.email)
  })
})
