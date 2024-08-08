import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { InMemoryPlanRepository } from 'test/repositories/in-memory-plan-repository'
import { UpdatePlanUseCase } from './update-plan'
import { makeGym } from 'test/factories/make-gym'
import { makePlan } from 'test/factories/make-plan'
import { InMemoryOwnerRepository } from 'test/repositories/in-memory-owner-repository'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { makeOwner } from 'test/factories/make-owner'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { makeEmployee } from 'test/factories/make-employee'

let inMemoryPlanRepository: InMemoryPlanRepository
let inMemoryGymRepository: InMemoryGymRepository
let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let inMemoryOwnerRepository: InMemoryOwnerRepository

let sut: UpdatePlanUseCase

describe('Update Plan Use Case', () => {
  beforeEach(() => {
    inMemoryPlanRepository = new InMemoryPlanRepository()
    inMemoryGymRepository = new InMemoryGymRepository()
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    inMemoryOwnerRepository = new InMemoryOwnerRepository()

    sut = new UpdatePlanUseCase(
      inMemoryPlanRepository,
      inMemoryGymRepository,
      inMemoryEmployeeRepository,
      inMemoryOwnerRepository,
    )
  })

  it('should be able to update a plan', async () => {
    const owner = makeOwner()

    inMemoryOwnerRepository.items.push(owner)

    const gym = makeGym({ ownerId: owner.id })

    inMemoryGymRepository.items.push(gym)

    const plan = makePlan({ gymId: gym.id }, 1)

    inMemoryPlanRepository.items.push(plan)

    const result = await sut.execute({
      discount: 10,
      duration: 60,
      planId: plan.id.toNumber(),
      managerId: owner.id.toString(),
      price: 20000,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      plan: inMemoryPlanRepository.items[0],
    })
  })

  it('should not be able to update a plan if it does not exist', async () => {
    const owner = makeOwner()

    inMemoryOwnerRepository.items.push(owner)

    const gym = makeGym({ ownerId: owner.id })

    inMemoryGymRepository.items.push(gym)

    const result = await sut.execute({
      discount: 10,
      duration: 60,
      planId: 1,
      managerId: owner.id.toString(),
      price: 20000,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update a plan if the gym does not exist', async () => {
    const owner = makeOwner()

    inMemoryOwnerRepository.items.push(owner)

    const plan = makePlan({}, 1)

    inMemoryPlanRepository.items.push(plan)

    const result = await sut.execute({
      discount: 10,
      duration: 60,
      planId: plan.id.toNumber(),
      managerId: owner.id.toString(),
      price: 20000,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update a plan if the manager does not exist', async () => {
    const owner = makeOwner()

    inMemoryOwnerRepository.items.push(owner)

    const gym = makeGym({ ownerId: owner.id })

    inMemoryGymRepository.items.push(gym)

    const plan = makePlan({ gymId: gym.id }, 1)

    inMemoryPlanRepository.items.push(plan)

    const result = await sut.execute({
      discount: 10,
      duration: 60,
      planId: plan.id.toNumber(),
      managerId: '1',
      price: 20000,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update a plan if the manager does not have permission', async () => {
    const owner = makeOwner()

    inMemoryOwnerRepository.items.push(owner)

    const gym = makeGym({ ownerId: owner.id })

    inMemoryGymRepository.items.push(gym)

    const plan = makePlan({ gymId: gym.id }, 1)

    inMemoryPlanRepository.items.push(plan)

    const employee = makeEmployee({ role: 'WORKER' })

    inMemoryEmployeeRepository.items.push(employee)

    const result = await sut.execute({
      discount: 10,
      duration: 60,
      planId: plan.id.toNumber(),
      managerId: employee.id.toString(),
      price: 20000,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PermissionDeniedError)
  })
})
