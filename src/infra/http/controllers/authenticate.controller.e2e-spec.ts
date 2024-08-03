import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { hash } from 'bcryptjs'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { EmployeeFactory } from 'test/factories/make-employee'
import { OwnerFactory } from 'test/factories/make-owner'
import { GymFactory } from 'test/factories/make-gym'
import { Owner } from '@/domain/gym/enterprise/entities/owner'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let employeeFactory: EmployeeFactory
  let ownerFactory: OwnerFactory
  let gymFactory: GymFactory
  let owner: Owner

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [EmployeeFactory, OwnerFactory, GymFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    employeeFactory = moduleRef.get(EmployeeFactory)
    ownerFactory = moduleRef.get(OwnerFactory)
    gymFactory = moduleRef.get(GymFactory)

    await app.init()

    owner = await ownerFactory.makePrismaOwner({
      email: 'johndoe@owner.com',
      password: await hash('12345678', 8),
    })
  })

  test('[POST] /auth (employee)', async () => {
    const gym = await gymFactory.makePrismaGym({
      ownerId: owner.id,
      cnpj: '12345678901234',
    })

    await employeeFactory.makePrismaEmployee({
      gymId: gym.id,
      rest: {
        email: 'johndoe@employee.com',
        password: await hash('12345678', 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/auth').send({
      email: 'johndoe@employee.com',
      password: '12345678',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })

  test('[POST] /auth (owner)', async () => {
    const response = await request(app.getHttpServer()).post('/auth').send({
      email: 'johndoe@owner.com',
      password: '12345678',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
