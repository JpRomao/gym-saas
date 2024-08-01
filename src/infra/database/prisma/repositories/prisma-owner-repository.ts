import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../prisma.service'
import { OwnerRepository } from '@/domain/gym/application/repositories/owner-repository'
import { Owner } from '@/domain/gym/enterprise/entities/owner'
import { PrismaOwnerMapper } from '../mappers/prisma-owner-mapper'

@Injectable()
export class PrismaOwnerRepository implements OwnerRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Owner | null> {
    const owner = await this.prisma.owner.findUnique({
      where: {
        email,
      },
    })

    if (!owner) {
      return null
    }

    return PrismaOwnerMapper.toDomain(owner)
  }

  async findById(id: string): Promise<Owner | null> {
    const owner = await this.prisma.owner.findUnique({
      where: {
        id,
      },
    })

    if (!owner) {
      return null
    }

    return PrismaOwnerMapper.toDomain(owner)
  }

  async create(owner: Owner): Promise<void> {
    const data = PrismaOwnerMapper.toPrisma(owner)

    await this.prisma.owner.create({
      data,
    })
  }

  async update(owner: Owner): Promise<void> {
    const data = PrismaOwnerMapper.toPrisma(owner)

    await this.prisma.owner.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
