import { Module } from '@nestjs/common'

import { PrismaService } from './prisma.service'
import { AdminRepository } from '@/domain/gym/application/repositories/admin-repository'
import { PrismaAdminRepository } from './prisma/repositories/prisma-admin-repository'
import { GymRepository } from '@/domain/gym/application/repositories/gym-repository'
import { PrismaGymRepository } from './prisma/repositories/prisma-gym-repository'
import { EmployeeRepository } from '@/domain/gym/application/repositories/employee-repository'
import { PlanRepository } from '@/domain/gym/application/repositories/plan-repository'
import { StudentRepository } from '@/domain/gym/application/repositories/student-repository'
import { PrismaEmployeeRepository } from './prisma/repositories/prisma-employee-repository'
import { PrismaPlanRepository } from './prisma/repositories/prisma-plan-repository'
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository'
import { OwnerRepository } from '@/domain/gym/application/repositories/owner-repository'
import { PrismaOwnerRepository } from './prisma/repositories/prisma-owner-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminRepository,
      useClass: PrismaAdminRepository,
    },
    {
      provide: GymRepository,
      useClass: PrismaGymRepository,
    },
    {
      provide: EmployeeRepository,
      useClass: PrismaEmployeeRepository,
    },
    {
      provide: PlanRepository,
      useClass: PrismaPlanRepository,
    },
    {
      provide: OwnerRepository,
      useClass: PrismaOwnerRepository,
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminRepository,
    GymRepository,
    EmployeeRepository,
    PlanRepository,
    StudentRepository,
    OwnerRepository,
  ],
})
export class DatabaseModule {}
