import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { GymFactory } from 'test/factories/make-gym'
import { AdminFactory } from 'test/factories/make-admin'
import { OwnerFactory } from 'test/factories/make-owner'
import { DatabaseModule } from '@/infra/database/database.module'

describe.todo('Register Student (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [GymFactory, AdminFactory, OwnerFactory],
    }).compile()

    app = module.createNestApplication()

    await app.init()
  })

  test('[POST] /students', async () => {
    const response = await request(app.getHttpServer()).post('/students').send()

    expect(response.statusCode).toBe(201)
  })
})
