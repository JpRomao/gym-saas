import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreatePlanUseCase } from '@/domain/gym/application/use-cases/create-plan'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { PermissionDeniedError } from '@/domain/gym/application/use-cases/errors/permission-denied-error'
import { CnpjAlreadyBeingUsedError } from '@/domain/gym/application/use-cases/errors/cnpj-already-being-used-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

const createPlanBodySchema = z.object({
  name: z.string(),
  duration: z.number(),
  price: z.number(),
  discount: z.number().nullable(),
  gymId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createPlanBodySchema)

type CreatePlanBodySchema = z.infer<typeof createPlanBodySchema>

@Controller('/plan')
export class CreatePlanController {
  constructor(private createPlan: CreatePlanUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreatePlanBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, duration, price, discount, gymId } = body
    const managerId = user.sub

    const result = await this.createPlan.execute({
      name,
      duration,
      price,
      discount,
      gymId,
      managerId,
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
