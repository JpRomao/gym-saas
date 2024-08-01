import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma.service'
import { AdminFactory } from 'test/factories/make-admin'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Create Gym (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /gym/create', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678',
    })

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/gym/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        cnpj: '12345678901234',
        name: 'Gym',
        phone: '11999999999',
        email: 'gym@email.com',
      })

    expect(response.statusCode).toBe(201)

    const gymOnDatabase = await prisma.gym.findUnique({
      where: {
        cnpj: '12345678901234',
      },
    })

    expect(gymOnDatabase).toBeTruthy()
  })
})
