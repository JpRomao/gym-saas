import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Owner, OwnerProps } from '@/domain/gym/enterprise/entities/owner'
import { PrismaService } from '@/infra/database/prisma.service'
import { PrismaOwnerMapper } from '@/infra/database/prisma/mappers/prisma-owner-mapper'

export function makeOwner(
  override: Partial<OwnerProps> = {},
  id?: UniqueEntityID,
) {
  return Owner.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class OwnerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOwner(data: Partial<OwnerProps> = {}): Promise<Owner> {
    const owner = makeOwner(data)

    await this.prisma.owner.create({
      data: PrismaOwnerMapper.toPrisma(owner),
    })

    return owner
  }
}
