import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeEmployee } from 'test/factories/make-employee'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { InMemoryOwnerRepository } from 'test/repositories/in-memory-owner-repository'
import { makeOwner } from 'test/factories/make-owner'
import { AuthenticateUseCase } from './authenticate'

let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let inMemoryOwnerRepository: InMemoryOwnerRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateUseCase

describe('Authenticate Employee', () => {
  beforeEach(() => {
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    inMemoryOwnerRepository = new InMemoryOwnerRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateUseCase(
      inMemoryEmployeeRepository,
      inMemoryOwnerRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate an employee', async () => {
    const employee = makeEmployee({
      email: 'johndoe@employee.com',
      password: await fakeHasher.hash('12345678'),
    })

    inMemoryEmployeeRepository.items.push(employee)

    const result = await sut.execute({
      email: 'johndoe@employee.com',
      password: '12345678',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should be able to authenticate an owner', async () => {
    const owner = makeOwner({
      email: 'johndoe@owner.com',
      password: await fakeHasher.hash('12345678'),
    })

    inMemoryOwnerRepository.items.push(owner)

    const result = await sut.execute({
      email: 'johndoe@owner.com',
      password: '12345678',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate an employee with wrong credentials', async () => {
    const employee = makeEmployee({
      email: 'johndoe@employee.com',
      password: await fakeHasher.hash('12345678'),
    })

    inMemoryEmployeeRepository.items.push(employee)

    const owner = makeOwner({
      email: 'johndoe@owner.com',
      password: await fakeHasher.hash('12345678'),
    })

    inMemoryOwnerRepository.items.push(owner)

    const wrongEmailResult = await sut.execute({
      email: 'johndoe@wrong.com',
      password: '12345678',
    })

    expect(wrongEmailResult.isLeft()).toBe(true)
    expect(wrongEmailResult.value).toBeInstanceOf(WrongCredentialsError)

    const wrongPasswordResult = await sut.execute({
      email: 'johndoe@owner.com',
      password: '123456789',
    })

    expect(wrongPasswordResult.isLeft()).toBe(true)
    expect(wrongPasswordResult.value).toBeInstanceOf(WrongCredentialsError)
  })
})
