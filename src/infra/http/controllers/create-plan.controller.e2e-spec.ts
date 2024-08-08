import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma.service'
import { OwnerFactory } from 'test/factories/make-owner'
import { GymFactory } from 'test/factories/make-gym'

describe('Create Plan (E2E)', () => {
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

  test('[POST] /plan', async () => {
    const owner = await ownerFactory.makePrismaOwner()

    const gym = await gymFactory.makePrismaGym({ ownerId: owner.id })

    const accessToken = jwt.sign({ sub: owner.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/plan')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Plano Mensal',
        duration: 30,
        price: 20000,
        discount: 0,
        gymId: gym.id.toString(),
      })
    await request(app.getHttpServer())
      .post('/plan')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Plano Mensal2',
        duration: 30,
        price: 20000,
        discount: 0,
        gymId: gym.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    const planOnDatabase = await prisma.plan.findUnique({
      where: {
        name: 'Plano Mensal',
      },
    })

    expect(planOnDatabase).toBeTruthy()
  })
})
