import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { InMemoryPlanRepository } from 'test/repositories/in-memory-plan-repository'
import { DeletePlanUseCase } from './delete-plan'
import { makePlan } from 'test/factories/make-plan'
import { makeEmployee } from 'test/factories/make-employee'

let inMemoryPlanRepository: InMemoryPlanRepository
let inMemoryEmployeeRepository: InMemoryEmployeeRepository

let sut: DeletePlanUseCase

describe('Delete Plan Use Case', () => {
  beforeEach(() => {
    inMemoryPlanRepository = new InMemoryPlanRepository()
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()

    sut = new DeletePlanUseCase(
      inMemoryPlanRepository,
      inMemoryEmployeeRepository,
    )
  })

  it('should delete a plan', async () => {
    const plan = makePlan()

    await inMemoryPlanRepository.create(plan)

    const employee = makeEmployee()

    await inMemoryEmployeeRepository.create(employee)

    const result = await sut.execute({
      planId: plan.id.toNumber(),
      employeeId: employee.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryPlanRepository.items).toHaveLength(0)
  })
})
