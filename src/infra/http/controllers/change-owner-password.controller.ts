import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'

import { ChangeOwnerPasswordUseCase } from '@/domain/gym/application/use-cases/change-owner-password'
import { Public } from '@/infra/auth/public'

const changeOwnerPasswordBodySchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
  email: z.string().email(),
})

type ChangeOwnerPasswordBodySchema = z.infer<
  typeof changeOwnerPasswordBodySchema
>

@Controller('/owner/password')
@Public()
export class ChangeOwnerPasswordController {
  constructor(private changeOwnerPasswordUseCase: ChangeOwnerPasswordUseCase) {}

  @Patch()
  @HttpCode(204)
  async changeOwnerPassword(@Body() body: ChangeOwnerPasswordBodySchema) {
    const { email, oldPassword, newPassword } = body

    const result = await this.changeOwnerPasswordUseCase.execute({
      email,
      oldPassword,
      newPassword,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
