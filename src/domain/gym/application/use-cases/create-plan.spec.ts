import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { InMemoryPlanRepository } from 'test/repositories/in-memory-plan-repository'
import { CreatePlanUseCase } from './create-plan'
import { makeGym } from 'test/factories/make-gym'
import { GymNotFoundError } from './errors/gym-not-found-error'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { makeEmployee } from 'test/factories/make-employee'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { InMemoryOwnerRepository } from 'test/repositories/in-memory-owner-repository'
import { makeOwner } from 'test/factories/make-owner'

let inMemoryPlanRepository: InMemoryPlanRepository
let inMemoryGymRepository: InMemoryGymRepository
let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let inMemoryOwnerRepository: InMemoryOwnerRepository

let sut: CreatePlanUseCase

describe('Create Plan', () => {
  beforeEach(() => {
    inMemoryPlanRepository = new InMemoryPlanRepository()
    inMemoryGymRepository = new InMemoryGymRepository()
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    inMemoryOwnerRepository = new InMemoryOwnerRepository()

    sut = new CreatePlanUseCase(
      inMemoryPlanRepository,
      inMemoryGymRepository,
      inMemoryEmployeeRepository,
      inMemoryOwnerRepository,
    )
  })

  it('should be able to create a plan', async () => {
    const gym = makeGym()

    await inMemoryGymRepository.create(gym)

    const manager = makeEmployee({
      gymId: gym.id,
      role: 'MANAGER',
    })

    await inMemoryEmployeeRepository.create(manager)

    const result = await sut.execute({
      managerId: manager.id.toString(),
      gymId: gym.id.toString(),
      name: 'Plan Test',
      discount: 10,
      duration: 60,
      price: 20000,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      plan: inMemoryPlanRepository.items[0],
    })
  })

  it('should be able to create a plan being a owner', async () => {
    const gym = makeGym()

    await inMemoryGymRepository.create(gym)

    const owner = makeOwner()

    await inMemoryOwnerRepository.create(owner)

    const result = await sut.execute({
      ownerId: owner.id.toString(),
      gymId: gym.id.toString(),
      name: 'Plan Test',
      discount: 10,
      duration: 60,
      price: 20000,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      plan: inMemoryPlanRepository.items[0],
    })
  })

  it('should not be able to create a plan with a non-existent gym', async () => {
    const manager = makeEmployee({ role: 'MANAGER' })

    const result = await sut.execute({
      discount: 10,
      duration: 60,
      gymId: 'non-existent-gym-id',
      price: 20000,
      name: 'Plan Test',
      managerId: manager.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(GymNotFoundError)
  })

  it('should not be able to create a plan without suficient permission', async () => {
    const gym = makeGym()

    await inMemoryGymRepository.create(gym)

    const worker = makeEmployee({ gymId: gym.id, role: 'WORKER' })

    await inMemoryEmployeeRepository.create(worker)

    const result = await sut.execute({
      discount: 10,
      duration: 60,
      gymId: gym.id.toString(),
      price: 20000,
      name: 'Plan Test',
      managerId: worker.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PermissionDeniedError)
  })
})
