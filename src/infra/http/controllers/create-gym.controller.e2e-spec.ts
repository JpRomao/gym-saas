import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma.service'
import { OwnerFactory } from 'test/factories/make-owner'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Create Gym (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let ownerFactory: OwnerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OwnerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    ownerFactory = moduleRef.get(OwnerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /gyms', async () => {
    const owner = await ownerFactory.makePrismaOwner()

    const accessToken = jwt.sign({ sub: owner.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/gyms')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Gym Name',
        cnpj: '12345678901234',
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
