import { Prisma, Owner as PrismaOwner } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Owner } from '@/domain/gym/enterprise/entities/owner'

export class PrismaOwnerMapper {
  static toDomain(raw: PrismaOwner): Owner {
    return Owner.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
        phone: raw.phone,
        firstLoginDate: raw.firstLoginDate,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(owner: Owner): Prisma.OwnerUncheckedCreateInput {
    return {
      email: owner.email,
      id: owner.id.toString(),
      name: owner.name,
      password: owner.password,
      phone: owner.phone,
      firstLoginDate: owner.firstLoginDate,
    }
  }
}
