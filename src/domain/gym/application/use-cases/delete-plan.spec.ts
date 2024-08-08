import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { InMemoryPlanRepository } from 'test/repositories/in-memory-plan-repository'
import { DeletePlanUseCase } from './delete-plan'
import { makePlan } from 'test/factories/make-plan'
import { makeEmployee } from 'test/factories/make-employee'
import { InMemoryOwnerRepository } from 'test/repositories/in-memory-owner-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { makeGym } from 'test/factories/make-gym'
import { makeOwner } from 'test/factories/make-owner'

let inMemoryPlanRepository: InMemoryPlanRepository
let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let inMemoryOwnerRepository: InMemoryOwnerRepository
let inMemoryGymRepository: InMemoryGymRepository

let sut: DeletePlanUseCase

describe('Delete Plan Use Case', () => {
  beforeEach(() => {
    inMemoryPlanRepository = new InMemoryPlanRepository()
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    inMemoryOwnerRepository = new InMemoryOwnerRepository()
    inMemoryGymRepository = new InMemoryGymRepository()

    sut = new DeletePlanUseCase(
      inMemoryPlanRepository,
      inMemoryEmployeeRepository,
      inMemoryOwnerRepository,
      inMemoryGymRepository,
    )
  })

  it('should delete a plan', async () => {
    const owner = makeOwner()

    await inMemoryOwnerRepository.create(owner)

    const gym = makeGym({ ownerId: owner.id })

    await inMemoryGymRepository.create(gym)

    const plan = makePlan({ gymId: gym.id }, 1)

    await inMemoryPlanRepository.create(plan)

    const employee = makeEmployee({ role: 'MANAGER' })

    await inMemoryEmployeeRepository.create(employee)

    const result = await sut.execute({
      planId: plan.id.toNumber(),
      managerId: employee.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryPlanRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a plan if it does not exist', async () => {
    const employee = makeEmployee({ role: 'MANAGER' })

    await inMemoryEmployeeRepository.create(employee)

    const result = await sut.execute({
      planId: 1,
      managerId: employee.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a plan if the manager is not found', async () => {
    const plan = makePlan({}, 1)

    await inMemoryPlanRepository.create(plan)

    const result = await sut.execute({
      planId: plan.id.toNumber(),
      managerId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a plan if the manager does not have permission', async () => {
    const gym = makeGym()

    await inMemoryGymRepository.create(gym)

    const plan = makePlan({ gymId: gym.id }, 1)

    await inMemoryPlanRepository.create(plan)

    const employee = makeEmployee({ role: 'WORKER' })

    await inMemoryEmployeeRepository.create(employee)

    const result = await sut.execute({
      planId: plan.id.toNumber(),
      managerId: employee.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PermissionDeniedError)
  })
})
