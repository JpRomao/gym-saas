import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RegisterAdminUseCase } from '@/domain/gym/application/use-cases/register-admin'
import { AdminAlreadyExistsError } from '@/domain/gym/application/use-cases/errors/admin-already-exists-error'
import { Public } from '@/infra/auth/public'

const createAdminAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAdminAccountBodySchema = z.infer<typeof createAdminAccountBodySchema>

@Controller('/admin/create')
@Public()
export class CreateAccountController {
  constructor(private registerAdmin: RegisterAdminUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAdminAccountBodySchema))
  async handle(@Body() body: CreateAdminAccountBodySchema) {
    const { name, email, password } = body

    const result = await this.registerAdmin.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AdminAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
