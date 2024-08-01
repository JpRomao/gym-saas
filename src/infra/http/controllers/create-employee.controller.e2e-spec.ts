import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma.service'
import { OwnerFactory } from 'test/factories/make-owner'
import { DatabaseModule } from '@/infra/database/database.module'
import { GymFactory } from 'test/factories/make-gym'

describe('Create Employee (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let ownerFactory: OwnerFactory
  let gymFactory: GymFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OwnerFactory, GymFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    ownerFactory = moduleRef.get(OwnerFactory)
    gymFactory = moduleRef.get(GymFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /employee/create', async () => {
    const owner = await ownerFactory.makePrismaOwner()

    const accessToken = jwt.sign({ sub: owner.id.toString() })

    const gym = await gymFactory.makePrismaGym({ ownerId: owner.id })

    const response = await request(app.getHttpServer())
      .post('/employee/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        gymId: gym.id.toString(),
        name: 'John Doe',
        cpf: '12345678901',
        email: 'johndoe@employee.com',
        phone: '12345678901',
        password: '12345678',
        role: 'WORKER',
        city: 'New York',
        number: '123',
        state: 'NY',
        street: 'Main St',
        zipCode: '12345-678',
      })

    expect(response.statusCode).toBe(201)

    const employeeOnDatabase = await prisma.employee.findUnique({
      where: {
        email: 'johndoe@employee.com',
      },
    })

    expect(employeeOnDatabase).toBeTruthy()
  })
})
