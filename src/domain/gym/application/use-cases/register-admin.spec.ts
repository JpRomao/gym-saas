import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { RegisterAdminUseCase } from './register-admin'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { AdminAlreadyExistsError } from './errors/admin-already-exists-error'

let inMemoryAdminRepository: InMemoryAdminRepository
let fakeHasher: FakeHasher

let sut: RegisterAdminUseCase

describe('RegisterAdminUseCase', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterAdminUseCase(inMemoryAdminRepository, fakeHasher)
  })

  it('should register a new admin', async () => {
    const result = await sut.execute({
      email: 'johndoe@email.com',
      password: '12345678',
      name: 'John Doe',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminRepository.items).toHaveLength(1)
  })

  it('should not register a new admin with an already registered email', async () => {
    await sut.execute({
      email: 'johndoe@email.com',
      password: '12345678',
      name: 'John Doe',
    })

    const result = await sut.execute({
      email: 'johndoe@email.com',
      password: '123456782',
      name: 'John Doe 2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AdminAlreadyExistsError)
  })
})
