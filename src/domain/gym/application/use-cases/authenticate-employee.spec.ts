import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { AuthenticateEmployeeUseCase } from './authenticate-employee'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeEmployee } from 'test/factories/make-employee'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateEmployeeUseCase

describe('Authenticate Employee', () => {
  beforeEach(() => {
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateEmployeeUseCase(
      inMemoryEmployeeRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate an employee', async () => {
    const employee = makeEmployee({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('12345678'),
    })

    inMemoryEmployeeRepository.items.push(employee)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '12345678',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate an employee with wrong credentials', async () => {
    const employee = makeEmployee({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('12345678'),
    })

    inMemoryEmployeeRepository.items.push(employee)

    const result = await sut.execute({
      email: 'johndoe@wrong.com',
      password: '12345678',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
