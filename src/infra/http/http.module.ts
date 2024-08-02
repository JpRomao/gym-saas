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
import { CreateEmployeeController } from './controllers/create-employee.controller'
import { AuthenticateUseCase } from '@/domain/gym/application/use-cases/authenticate'
import { AuthenticateController } from './controllers/authenticate.controller'
import { FetchAllGymsUseCase } from '@/domain/gym/application/use-cases/fetch-all-gyms'
import { FetchAllGymsController } from './controllers/fetch-all-gyms.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateAdminController,
    AuthenticateController,
    CreateAccountController,
    CreateGymController,
    CreateEmployeeController,
    FetchAllGymsController,
  ],
  providers: [
    ActivateGymPremiumUseCase,
    AuthenticateAdminUseCase,
    AuthenticateUseCase,
    CreateOwnerUseCase,
    CreateEmployeeUseCase,
    CreateGymUseCase,
    CreatePlanUseCase,
    DeletePlanUseCase,
    FetchAllGymsUseCase,
    FindGymByCnpjUseCase,
    RegisterAdminUseCase,
    RegisterStudentUseCase,
    UpdateGymUseCase,
    UpdatePlanUseCase,
    UpdateStudentUseCase,
  ],
})
export class HttpModule {}
