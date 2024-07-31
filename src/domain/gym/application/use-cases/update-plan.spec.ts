import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { InMemoryPlanRepository } from 'test/repositories/in-memory-plan-repository'
import { UpdatePlanUseCase } from './update-plan'
import { makeGym } from 'test/factories/make-gym'
import { makePlan } from 'test/factories/make-plan'

let inMemoryPlanRepository: InMemoryPlanRepository
let inMemoryGymRepository: InMemoryGymRepository

let sut: UpdatePlanUseCase

describe('Update Plan', () => {
  beforeEach(() => {
    inMemoryPlanRepository = new InMemoryPlanRepository()
    inMemoryGymRepository = new InMemoryGymRepository()

    sut = new UpdatePlanUseCase(inMemoryPlanRepository, inMemoryGymRepository)
  })

  it('should be able to update a plan', async () => {
    const gym = makeGym()

    await inMemoryGymRepository.create(gym)

    const plan = makePlan({ gymId: gym.id })

    await inMemoryPlanRepository.create(plan)

    const result = await sut.execute({
      discount: 10,
      duration: 60,
      gymId: gym.id.toString(),
      planId: plan.id.toString(),
      price: 20000,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      plan: inMemoryPlanRepository.items[0],
    })
  })
})
