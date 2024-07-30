import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { CreateEmployeeUseCase } from './create-employee'
import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { makeGym } from 'test/factories/make-gym'
import { EmployeeRoles } from '../../enterprise/entities/employee'

let inMemoryEmployeesRepository: InMemoryEmployeeRepository
let inMemoryGymsRepository: InMemoryGymRepository
let fakeHasher: FakeHasher

let sut: CreateEmployeeUseCase

describe('Activate Employee Premium Plan', () => {
  beforeEach(() => {
    inMemoryEmployeesRepository = new InMemoryEmployeeRepository()
    inMemoryGymsRepository = new InMemoryGymRepository()

    fakeHasher = new FakeHasher()

    sut = new CreateEmployeeUseCase(
      inMemoryEmployeesRepository,
      inMemoryGymsRepository,
      fakeHasher,
    )
  })

  it('should be able to create an employee', async () => {
    const gym = makeGym()

    await inMemoryGymsRepository.create(gym)

    const result = await sut.execute({
      cpf: '12345678909',
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
      gymId: gym.id.toString(),
      phone: '99999999999',
      role: EmployeeRoles.WORKER,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      employee: inMemoryEmployeesRepository.items[0],
    })
  })

  it('should hash employee password upon registration', async () => {
    const gym = makeGym()

    await inMemoryGymsRepository.create(gym)

    const result = await sut.execute({
      cpf: '12345678909',
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
      gymId: gym.id.toString(),
      phone: '99999999999',
      role: EmployeeRoles.WORKER,
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryEmployeesRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
