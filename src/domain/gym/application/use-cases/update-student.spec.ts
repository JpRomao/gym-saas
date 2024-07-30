import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { UpdateStudentUseCase } from './update-student'
import { makeStudent } from 'test/factories/make-student'
import { generateAddress } from 'test/utils/generate-address'

let inMemoryStudentRepository: InMemoryStudentRepository

let sut: UpdateStudentUseCase

describe('Update Student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()

    sut = new UpdateStudentUseCase(inMemoryStudentRepository)
  })

  it('should update a student', async () => {
    const student = makeStudent()
    await inMemoryStudentRepository.create(student)

    student.name = 'new name'
    student.email = 'newEmail@email.com'
    student.phone = 'new phone'

    const result = await sut.execute({
      address: student.address,
      email: student.email,
      hasMedicalRestriction: student.hasMedicalRestriction,
      height: student.height,
      medicalRestrictionDescription: student.medicalRestrictionDescription,
      name: student.name,
      phone: student.phone,
      studentId: student.id.toString(),
      weight: student.weight,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentRepository.items[0].name).toEqual('new name')
  })

  it('should not update a student if it does not exist', async () => {
    const result = await sut.execute({
      address: generateAddress(),
      email: 'email',
      hasMedicalRestriction: false,
      height: 1.7,
      medicalRestrictionDescription: 'description',
      name: 'name',
      phone: 'phone',
      studentId: '123',
      weight: 70,
    })

    expect(result.isLeft()).toBe(true)
  })
})
