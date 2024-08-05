import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma.service'
import { AdminFactory } from 'test/factories/make-admin'

describe('Create Owner (E2E)', () => {
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

  test('[POST] /admin/create-owner', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/admin/create-owner')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Owner Name',
        email: 'johndoe@owner.com',
        phone: '11999999999',
      })

    expect(response.statusCode).toBe(201)

    const ownerOnDatabase = await prisma.owner.findUnique({
      where: {
        email: 'johndoe@owner.com',
      },
    })

    expect(ownerOnDatabase).toBeTruthy()
  })
})
