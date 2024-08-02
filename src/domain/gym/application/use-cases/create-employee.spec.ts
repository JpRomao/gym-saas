import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { CreateEmployeeUseCase } from './create-employee'
import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { makeGym } from 'test/factories/make-gym'
import { InMemoryOwnerRepository } from 'test/repositories/in-memory-owner-repository'
import { makeOwner } from 'test/factories/make-owner'
import { makeEmployee } from 'test/factories/make-employee'

let inMemoryEmployeesRepository: InMemoryEmployeeRepository
let inMemoryGymsRepository: InMemoryGymRepository
let inMemoryOwnerRepository: InMemoryOwnerRepository
let fakeHasher: FakeHasher

let sut: CreateEmployeeUseCase

describe('Activate Employee Premium Plan Use Case', () => {
  beforeEach(() => {
    inMemoryEmployeesRepository = new InMemoryEmployeeRepository()
    inMemoryGymsRepository = new InMemoryGymRepository()
    inMemoryOwnerRepository = new InMemoryOwnerRepository()

    fakeHasher = new FakeHasher()

    sut = new CreateEmployeeUseCase(
      inMemoryEmployeesRepository,
      inMemoryGymsRepository,
      inMemoryOwnerRepository,
      fakeHasher,
    )
  })

  it('should be able to create an employee as owner', async () => {
    const owner = makeOwner()

    inMemoryOwnerRepository.items.push(owner)

    const gym = makeGym({ ownerId: owner.id })

    await inMemoryGymsRepository.create(gym)

    const result = await sut.execute({
      cpf: '12345678909',
      email: 'johndoe@employee.com',
      name: 'John Doe',
      password: '123456',
      gymId: gym.id.toString(),
      ownerId: owner.id.toString(),
      phone: '99999999999',
      role: 'WORKER',
      address: 'Rua dos Bobos, 0',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      employee: inMemoryEmployeesRepository.items[0],
    })
  })

  it('should be able to create an employee as manager', async () => {
    const owner = makeOwner()

    inMemoryOwnerRepository.items.push(owner)

    const gym = makeGym({ ownerId: owner.id })

    await inMemoryGymsRepository.create(gym)

    const manager = makeEmployee({ role: 'MANAGER' })

    await inMemoryEmployeesRepository.create(manager)

    const result = await sut.execute({
      cpf: '12345678909',
      email: 'johndoe@employee.com',
      name: 'John Doe',
      password: '123456',
      gymId: gym.id.toString(),
      phone: '99999999999',
      role: 'WORKER',
      address: 'Rua dos Bobos, 0',
      employeeId: manager.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      employee: inMemoryEmployeesRepository.items[1],
    })
  })

  it('should hash employee password upon registration', async () => {
    const owner = makeOwner()

    inMemoryOwnerRepository.items.push(owner)

    const gym = makeGym({ ownerId: owner.id })

    await inMemoryGymsRepository.create(gym)

    const result = await sut.execute({
      cpf: '12345678909',
      email: 'johndoe@employee.com',
      name: 'John Doe',
      password: '12345678',
      gymId: gym.id.toString(),
      phone: '99999999999',
      role: 'WORKER',
      address: 'Rua dos Bobos, 0',
      ownerId: owner.id.toString(),
    })

    const hashedPassword = await fakeHasher.hash('12345678')

    expect(result.isRight()).toBe(true)
    expect(inMemoryEmployeesRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
