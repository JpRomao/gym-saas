import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { InMemoryPlanRepository } from 'test/repositories/in-memory-plan-repository'
import { CreatePlanUseCase } from './create-plan'
import { makeGym } from 'test/factories/make-gym'
import { GymNotFoundError } from './errors/gym-not-found-error'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { makeEmployee } from 'test/factories/make-employee'
import { EmployeeRoles } from '../../enterprise/entities/employee'
import { PermissionDeniedError } from './errors/permission-denied-error'

let inMemoryPlanRepository: InMemoryPlanRepository
let inMemoryGymRepository: InMemoryGymRepository
let inMemoryEmployeeRepository: InMemoryEmployeeRepository

let sut: CreatePlanUseCase

describe('Create Plan', () => {
  beforeEach(() => {
    inMemoryPlanRepository = new InMemoryPlanRepository()
    inMemoryGymRepository = new InMemoryGymRepository()
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()

    sut = new CreatePlanUseCase(
      inMemoryPlanRepository,
      inMemoryGymRepository,
      inMemoryEmployeeRepository,
    )
  })

  it('should be able to create a plan', async () => {
    const gym = makeGym()

    await inMemoryGymRepository.create(gym)

    const employee = makeEmployee({ gymId: gym.id, role: EmployeeRoles.OWNER })

    await inMemoryEmployeeRepository.create(employee)

    const result = await sut.execute({
      employeeId: employee.id.toString(),
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
    const result = await sut.execute({
      discount: 10,
      duration: 60,
      gymId: 'non-existent-gym-id',
      price: 20000,
      name: 'Plan Test',
      employeeId: 'employee-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(GymNotFoundError)
  })

  it('should not be able to create a plan without suficient permission', async () => {
    const gym = makeGym()

    await inMemoryGymRepository.create(gym)

    const employee = makeEmployee({ gymId: gym.id, role: EmployeeRoles.WORKER })

    await inMemoryEmployeeRepository.create(employee)

    const result = await sut.execute({
      discount: 10,
      duration: 60,
      gymId: gym.id.toString(),
      price: 20000,
      name: 'Plan Test',
      employeeId: employee.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PermissionDeniedError)
  })
})
