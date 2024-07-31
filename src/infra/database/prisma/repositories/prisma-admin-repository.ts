import { Injectable } from '@nestjs/common'

import { AdminRepository } from '@/domain/gym/application/repositories/admin-repository'
import { Admin } from '@/domain/gym/enterprise/entities/admin'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class PrismaAdminRepository implements AdminRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: {
        email,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.admin.create({
      data,
    })
  }

  // async delete(admin: Admin): Promise<void> {
  //   const data = PrismaAdminMapper.toPrisma(admin)

  //   await this.prisma.admin.delete({
  //     where: {
  //       id: data.id,
  //     },
  //   })
  // }
}
