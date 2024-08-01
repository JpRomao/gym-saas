import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/gym/enterprise/entities/admin'
import { PrismaService } from '@/infra/database/prisma.service'
import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/prisma-admin-mapper'

export function makeAdmin(override: Partial<Admin> = {}, id?: UniqueEntityID) {
  return Admin.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(data)

    await this.prisma.admin.create({
      data: PrismaAdminMapper.toPrisma(admin),
    })

    return admin
  }
}
