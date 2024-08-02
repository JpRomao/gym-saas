import { FetchAllGymsUseCase } from '@/domain/gym/application/use-cases/fetch-all-gyms'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { GymPresenter } from '../presenters/gym-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/admin/gyms')
export class FetchAllGymsController {
  constructor(private fetchAllGymsUseCase: FetchAllGymsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const adminId = user.sub

    const result = await this.fetchAllGymsUseCase.execute({
      adminId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const gyms = result.value.gyms

    return { gyms: gyms.map(GymPresenter.toHTTP) }
  }
}
