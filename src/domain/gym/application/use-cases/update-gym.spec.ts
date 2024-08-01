import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { makeGym } from 'test/factories/make-gym'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { makeEmployee } from 'test/factories/make-employee'
import { UpdateGymUseCase } from './update-gym'
import { EmployeeNotFoundError } from './errors/employee-not-found-error'
import { EmployeeRoles } from '../../enterprise/entities/employee'
import { PermissionDeniedError } from './errors/permission-denied-error'

let inMemoryGymsRepository: InMemoryGymRepository
let inMemoryEmployeesRepository: InMemoryEmployeeRepository

let sut: UpdateGymUseCase

describe('Update Gym', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymRepository()
    inMemoryEmployeesRepository = new InMemoryEmployeeRepository()

    sut = new UpdateGymUseCase(
      inMemoryGymsRepository,
      inMemoryEmployeesRepository,
    )
  })

  it('should be able to update a gym', async () => {
    const gym = makeGym()

    await inMemoryGymsRepository.create(gym)

    const employee = makeEmployee({ gymId: gym.id, role: EmployeeRoles.OWNER })

    await inMemoryEmployeesRepository.create(employee)

    const result = await sut.execute({
      cnpj: gym.cnpj,
      employeeId: employee.id.toString(),
      name: 'New Gym Name',
      phone: '99999999999',
      gymId: gym.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryGymsRepository.items[0].name).toEqual('New Gym Name')
    expect(inMemoryGymsRepository.items[0].phone).toEqual('99999999999')
  })

  it('should not be able to update a gym with an invalid employee', async () => {
    const gym = makeGym()

    await inMemoryGymsRepository.create(gym)

    const result = await sut.execute({
      cnpj: gym.cnpj,
      employeeId: 'invalid-employee-id',
      name: 'New Gym Name',
      phone: '99999999999',
      gymId: gym.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmployeeNotFoundError)
  })

  it('should not be able to update a gym with an employee that does not work at the gym', async () => {
    const gym = makeGym()

    await inMemoryGymsRepository.create(gym)

    const employee = makeEmployee()

    await inMemoryEmployeesRepository.create(employee)

    const result = await sut.execute({
      cnpj: gym.cnpj,
      employeeId: employee.id.toString(),
      name: 'New Gym Name',
      phone: '99999999999',
      gymId: gym.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PermissionDeniedError)
  })

  it('should not be able to update a gym with an employee that does not have permission', async () => {
    const gym = makeGym()

    await inMemoryGymsRepository.create(gym)

    const employee = makeEmployee({ gymId: gym.id, role: EmployeeRoles.WORKER })

    await inMemoryEmployeesRepository.create(employee)

    const result = await sut.execute({
      cnpj: gym.cnpj,
      employeeId: employee.id.toString(),
      name: 'New Gym Name',
      phone: '99999999999',
      gymId: gym.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PermissionDeniedError)
  })
})
