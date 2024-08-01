import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { ActivateGymPremiumUseCase } from '@/domain/gym/application/use-cases/activate-gym-premium'
import { CreateEmployeeUseCase } from '@/domain/gym/application/use-cases/create-employee'
import { CreateGymUseCase } from '@/domain/gym/application/use-cases/create-gym'
import { CreatePlanUseCase } from '@/domain/gym/application/use-cases/create-plan'
import { DeletePlanUseCase } from '@/domain/gym/application/use-cases/delete-plan'
import { FindGymByCnpjUseCase } from '@/domain/gym/application/use-cases/find-gym-by-cnpj'
import { RegisterAdminUseCase } from '@/domain/gym/application/use-cases/register-admin'
import { RegisterStudentUseCase } from '@/domain/gym/application/use-cases/register-student'
import { UpdateGymUseCase } from '@/domain/gym/application/use-cases/update-gym'
import { UpdatePlanUseCase } from '@/domain/gym/application/use-cases/update-plan'
import { UpdateStudentUseCase } from '@/domain/gym/application/use-cases/update-student'
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { CreateAccountController } from './controllers/create-admin.controller'
import { CreateGymController } from './controllers/create-gym.controller'
import { AuthenticateAdminUseCase } from '@/domain/gym/application/use-cases/authenticate-admin'
import { CreateOwnerUseCase } from '@/domain/gym/application/use-cases/create-owner'
import { AuthenticateEmployeeUseCase } from '@/domain/gym/application/use-cases/authenticate-employee'
import { CreateEmployeeController } from './controllers/create-employee.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateAdminController,
    CreateAccountController,
    CreateGymController,
    CreateEmployeeController,
  ],
  providers: [
    ActivateGymPremiumUseCase,
    AuthenticateAdminUseCase,
    AuthenticateEmployeeUseCase,
    CreateOwnerUseCase,
    CreateEmployeeUseCase,
    CreateGymUseCase,
    CreatePlanUseCase,
    DeletePlanUseCase,
    FindGymByCnpjUseCase,
    RegisterAdminUseCase,
    RegisterStudentUseCase,
    UpdateGymUseCase,
    UpdatePlanUseCase,
    UpdateStudentUseCase,
  ],
})
export class HttpModule {}
