import { InMemoryGymRepository } from 'test/repositories/in-memory-gym-repository'
import { FetchAllGymsUseCase } from './fetch-all-gyms'
import { makeGym } from 'test/factories/make-gym'
import { makeOwner } from 'test/factories/make-owner'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { makeAdmin } from 'test/factories/make-admin'

let inMemoryGymRepository: InMemoryGymRepository
let inMemoryAdminRepository: InMemoryAdminRepository

let sut: FetchAllGymsUseCase

describe('Fetch All Gyms Use Case', () => {
  beforeEach(() => {
    inMemoryGymRepository = new InMemoryGymRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()

    sut = new FetchAllGymsUseCase(
      inMemoryGymRepository,
      inMemoryAdminRepository,
    )
  })

  it('should fetch all gyms', async () => {
    const owner = makeOwner()
    const admin = makeAdmin()

    await inMemoryAdminRepository.create(admin)

    await inMemoryGymRepository.create(
      makeGym({ ownerId: owner.id, createdAt: new Date(2024, 0, 12) }),
    )

    await inMemoryGymRepository.create(
      makeGym({ ownerId: owner.id, createdAt: new Date(2023, 0, 20) }),
    )
    await inMemoryGymRepository.create(
      makeGym({ ownerId: owner.id, createdAt: new Date(2024, 4, 23) }),
    )

    await sut.execute({ page: 1, adminId: admin.id.toString() })

    expect(inMemoryGymRepository.items).toHaveLength(3)
    expect(inMemoryGymRepository.items).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 12) }),
      expect.objectContaining({ createdAt: new Date(2024, 4, 23) }),
    ])
  })

  it('should be able to fetch paginated gyms', async () => {
    const gymCreationPromises: Promise<void>[] = []

    for (let i = 0; i < 22; i++) {
      gymCreationPromises.push(inMemoryGymRepository.create(makeGym()))
    }

    await Promise.all(gymCreationPromises)

    const admin = makeAdmin()

    await inMemoryAdminRepository.create(admin)

    const resultPage1 = await sut.execute({
      page: 1,
      adminId: admin.id.toString(),
    })
    const resultPage2 = await sut.execute({
      page: 2,
      adminId: admin.id.toString(),
    })

    expect(resultPage1.isRight()).toBe(true)

    if (resultPage1.isRight()) {
      expect(resultPage1.value.gyms).toHaveLength(20)
    }

    expect(resultPage2.isRight()).toBe(true)

    if (resultPage2.isRight()) {
      expect(resultPage2.value.gyms).toHaveLength(2)
    }
  })
})
