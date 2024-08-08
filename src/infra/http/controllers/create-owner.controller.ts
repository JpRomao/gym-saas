import {
  BadRequestException,
  Body,
  ForbiddenException,
  Controller,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateOwnerUseCase } from '@/domain/gym/application/use-cases/create-owner'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { PermissionDeniedError } from '@/domain/gym/application/use-cases/errors/permission-denied-error'

const createOwnerAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createOwnerAccountBodySchema)

type CreateOwnerAccountBodySchema = z.infer<typeof createOwnerAccountBodySchema>

@Controller('/admin/create-owner')
export class CreateOwnerController {
  constructor(private createOwner: CreateOwnerUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateOwnerAccountBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, email, phone } = body
    const adminId = user.sub

    const result = await this.createOwner.execute({
      name,
      email,
      adminId,
      phone,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case PermissionDeniedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
