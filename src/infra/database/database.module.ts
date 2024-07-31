import { Module } from '@nestjs/common'

import { PrismaService } from './prisma.service'

@Module({
  imports: [],
  providers: [],
  exports: [PrismaService],
})
export class DatabaseModule {}
