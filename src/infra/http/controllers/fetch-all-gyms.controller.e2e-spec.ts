import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { GymFactory } from 'test/factories/make-gym'
import { AdminFactory } from 'test/factories/make-admin'
import { OwnerFactory } from 'test/factories/make-owner'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch All Gyms (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let gymFactory: GymFactory
  let adminFactory: AdminFactory
  let ownerFactory: OwnerFactory

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [GymFactory, AdminFactory, OwnerFactory],
    }).compile()

    app = module.createNestApplication()

    jwt = module.get(JwtService)
    gymFactory = module.get(GymFactory)
    adminFactory = module.get(AdminFactory)
    ownerFactory = module.get(OwnerFactory)

    await app.init()
  })

  test('[GET] /admin/gyms', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const owner = await ownerFactory.makePrismaOwner()

    const makeGyms = Array.from({ length: 22 }).map(() =>
      gymFactory.makePrismaGym({ ownerId: owner.id }),
    )

    await Promise.all(makeGyms)

    const responsePage1 = await request(app.getHttpServer())
      .get('/admin/gyms')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ page: '1' })
      .send()

    expect(responsePage1.status).toBe(200)
    expect(responsePage1.body.gyms).toHaveLength(20)

    const responsePage2 = await request(app.getHttpServer())
      .get('/admin/gyms')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ page: '2' })
      .send()

    expect(responsePage2.status).toBe(200)
    expect(responsePage2.body.gyms).toHaveLength(2)
  })
})
