import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Student, StudentProps } from '@/domain/gym/enterprise/entities/student'
import { generateAddress } from 'test/utils/generate-address'

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const address = generateAddress()

  const student = Student.create(
    {
      address,
      birthday: faker.date.past(),
      cpf: faker.string.numeric(11),
      email: faker.internet.email(),
      gender: 'MALE',
      hasMedicalRestriction: true,
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      gymId: new UniqueEntityID(),
      medicalRestrictionDescription: faker.lorem.sentence(),
      planId: new UniqueEntityID(),
      weight: 70,
      height: 1.7,
      lastPaymentDate: faker.date.past(),
      ...override,
    },
    id,
  )

  return student
}
