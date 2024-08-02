import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { AuthenticateAdminUseCase } from './authenticate-admin'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeAdmin } from 'test/factories/make-admin'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryAdminRepository: InMemoryAdminRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateAdminUseCase

describe('Authenticate Admin Use Case', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateAdminUseCase(
      inMemoryAdminRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate an admin', async () => {
    const admin = makeAdmin({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('12345678'),
    })

    inMemoryAdminRepository.items.push(admin)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '12345678',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate an admin with wrong credentials', async () => {
    const admin = makeAdmin({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('12345678'),
    })

    inMemoryAdminRepository.items.push(admin)

    const result = await sut.execute({
      email: 'johndoe@wrong.com',
      password: '12345678',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
