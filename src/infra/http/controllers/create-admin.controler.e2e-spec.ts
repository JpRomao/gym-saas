import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma.service'

describe('Create Admin (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /admin/create', async () => {
    const response = await request(app.getHttpServer())
      .post('/admin/create')
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '12345678',
      })

    expect(response.statusCode).toBe(201)

    const adminOnDatabase = await prisma.admin.findUnique({
      where: {
        email: 'johndoe@email.com',
      },
    })

    expect(adminOnDatabase).toBeTruthy()
  })
})
