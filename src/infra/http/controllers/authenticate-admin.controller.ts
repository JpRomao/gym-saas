import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { AuthenticateAdminUseCase } from '@/domain/gym/application/use-cases/authenticate-admin'
import { WrongCredentialsError } from '@/domain/gym/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'

const authenticateAdminBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateAdminBodySchema>

@Controller('/admin/authenticate')
@Public()
export class AuthenticateAdminController {
  constructor(private authenticateAdmin: AuthenticateAdminUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateAdminBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateAdmin.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
