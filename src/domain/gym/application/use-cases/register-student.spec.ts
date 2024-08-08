import { InMemoryPlanRepository } from 'test/repositories/in-memory-plan-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { RegisterStudentUseCase } from './register-student'
import { makePlan } from 'test/factories/make-plan'
import { makeStudent } from 'test/factories/make-student'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryPlanRepository: InMemoryPlanRepository

let sut: RegisterStudentUseCase

describe('Register Student Use Case', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryPlanRepository = new InMemoryPlanRepository()

    sut = new RegisterStudentUseCase(
      inMemoryStudentRepository,
      inMemoryPlanRepository,
    )
  })

  it('should register a student', async () => {
    const plan = makePlan({}, 1)

    await inMemoryPlanRepository.create(plan)

    const student = makeStudent({ planId: plan.id })

    const result = await sut.execute({
      planId: student.planId.toNumber(),
      address: student.address,
      birthday: student.birthday,
      cpf: student.cpf,
      email: student.email,
      gender: student.gender,
      hasMedicalRestriction: student.hasMedicalRestriction,
      medicalRestrictionDescription: student.medicalRestrictionDescription,
      name: student.name,
      phone: student.phone,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentRepository.items[0],
    })
  })

  it('should register a student in multiple gyms', async () => {
    const plan1 = makePlan({}, 1)
    const plan2 = makePlan({}, 2)

    await inMemoryPlanRepository.create(plan1)
    await inMemoryPlanRepository.create(plan2)

    const student = makeStudent({ planId: plan1.id })

    const result = await sut.execute({
      planId: student.planId.toNumber(),
      address: student.address,
      birthday: student.birthday,
      cpf: student.cpf,
      email: student.email,
      gender: student.gender,
      hasMedicalRestriction: student.hasMedicalRestriction,
      medicalRestrictionDescription: student.medicalRestrictionDescription,
      name: student.name,
      phone: student.phone,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentRepository.items[0],
    })

    const student2 = makeStudent({
      cpf: student.cpf,
      planId: plan2.id,
    })

    const result2 = await sut.execute({
      planId: student2.planId.toNumber(),
      address: student2.address,
      birthday: student2.birthday,
      cpf: student2.cpf,
      email: student2.email,
      gender: student2.gender,
      hasMedicalRestriction: student2.hasMedicalRestriction,
      medicalRestrictionDescription: student2.medicalRestrictionDescription,
      name: student2.name,
      phone: student2.phone,
    })

    expect(result2.isRight()).toBe(true)
    expect(result2.value).toEqual({
      student: inMemoryStudentRepository.items[1],
    })

    expect(inMemoryStudentRepository.items[0].cpf).toEqual(
      inMemoryStudentRepository.items[1].cpf,
    )
    expect(inMemoryStudentRepository.items[0].gymId).not.toEqual(
      inMemoryStudentRepository.items[1].gymId,
    )
  })

  it('should not register a student if plan does not exist', async () => {
    const student = makeStudent()

    const result = await sut.execute({
      planId: student.planId.toNumber(),
      address: student.address,
      birthday: student.birthday,
      cpf: student.cpf,
      email: student.email,
      gender: student.gender,
      hasMedicalRestriction: student.hasMedicalRestriction,
      medicalRestrictionDescription: student.medicalRestrictionDescription,
      name: student.name,
      phone: student.phone,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not register a student if student already exists at this gym', async () => {
    const plan = makePlan({}, 1)

    await inMemoryPlanRepository.create(plan)

    const student = makeStudent({
      planId: plan.id,
      gymId: plan.gymId,
    })

    await sut.execute({
      planId: student.planId.toNumber(),
      address: student.address,
      birthday: student.birthday,
      cpf: student.cpf,
      email: student.email,
      gender: student.gender,
      hasMedicalRestriction: student.hasMedicalRestriction,
      medicalRestrictionDescription: student.medicalRestrictionDescription,
      name: student.name,
      phone: student.phone,
    })

    const result = await sut.execute({
      planId: student.planId.toNumber(),
      address: student.address,
      birthday: student.birthday,
      cpf: student.cpf,
      email: student.email,
      gender: student.gender,
      hasMedicalRestriction: student.hasMedicalRestriction,
      medicalRestrictionDescription: student.medicalRestrictionDescription,
      name: student.name,
      phone: student.phone,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError)
  })
})
