import {
  BadRequestException,
  ForbiddenException,
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { CreateGymUseCase } from '@/domain/gym/application/use-cases/create-gym'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { CnpjAlreadyBeingUsedError } from '@/domain/gym/application/use-cases/errors/cnpj-already-being-used-error'
import { PermissionDeniedError } from '@/domain/gym/application/use-cases/errors/permission-denied-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

const createGymBodySchema = z.object({
  name: z.string(),
  cnpj: z.string(),
  phone: z.string(),
  email: z.string().email(),
})

const bodyValidationPipe = new ZodValidationPipe(createGymBodySchema)

type CreateGymBodySchema = z.infer<typeof createGymBodySchema>

@Controller('/gyms')
export class CreateGymController {
  constructor(private createGym: CreateGymUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateGymBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, cnpj, phone, email } = body
    const ownerId = user.sub

    const result = await this.createGym.execute({
      name,
      cnpj,
      phone,
      email,
      ownerId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case CnpjAlreadyBeingUsedError:
          throw new ConflictException(error.message)
        case PermissionDeniedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
