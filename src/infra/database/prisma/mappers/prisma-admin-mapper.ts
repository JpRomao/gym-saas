import { Admin as PrismaAdmin, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin } from '@/domain/gym/enterprise/entities/admin'

export class PrismaAdminMapper {
  static toDomain(raw: PrismaAdmin): Admin {
    return Admin.create(
      {
        email: raw.email,
        password: raw.password,
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.AdminUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      email: admin.email,
      password: admin.password,
      name: admin.name,
    }
  }
}
