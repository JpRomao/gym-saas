import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { CreateGymUseCase } from '@/domain/gym/application/use-cases/create-gym'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { CnpjAlreadyBeingUsedError } from '@/domain/gym/application/use-cases/errors/cnpj-already-being-used-error'

const createGymBodySchema = z.object({
  name: z.string(),
  cnpj: z.string(),
  phone: z.string(),
  email: z.string().email(),
})

const bodyValidationPipe = new ZodValidationPipe(createGymBodySchema)

type CreateGymBodySchema = z.infer<typeof createGymBodySchema>

@Controller('/gym/create')
export class CreateGymController {
  constructor(private createGym: CreateGymUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateGymBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, cnpj, phone, email } = body
    const userId = user.sub

    const result = await this.createGym.execute({
      name,
      cnpj,
      phone,
      email,
      adminId: userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CnpjAlreadyBeingUsedError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
