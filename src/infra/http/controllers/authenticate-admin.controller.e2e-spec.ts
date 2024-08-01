import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { hash } from 'bcryptjs'

import { AppModule } from '@/infra/app.module'
import { AdminFactory } from 'test/factories/make-admin'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Authenticate Admin (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[POST] /admin/authenticate', async () => {
    await adminFactory.makePrismaAdmin({
      email: 'johndoe@email.com',
      password: await hash('12345678', 8),
    })

    const response = await request(app.getHttpServer())
      .post('/admin/authenticate')
      .send({
        email: 'johndoe@email.com',
        password: '12345678',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
