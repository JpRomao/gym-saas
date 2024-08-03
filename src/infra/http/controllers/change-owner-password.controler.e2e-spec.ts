import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { OwnerFactory } from 'test/factories/make-owner'
import { hash } from 'bcryptjs'

describe('Change Owner Password (E2E)', () => {
  let app: INestApplication
  let ownerFactory: OwnerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OwnerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    ownerFactory = moduleRef.get(OwnerFactory)

    await app.init()
  })

  test('[PATCH] /owner/password', async () => {
    const owner = await ownerFactory.makePrismaOwner({
      email: 'johndoe@owner.com',
      password: await hash('12345678', 8),
    })

    const response = await request(app.getHttpServer())
      .patch('/owner/password')
      .send({
        email: owner.email,
        newPassword: 'new-password',
        oldPassword: '12345678',
      })

    expect(response.statusCode).toBe(204)
  })
})
