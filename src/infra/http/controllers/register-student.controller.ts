import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { RegisterStudentUseCase } from '@/domain/gym/application/use-cases/register-student'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { concatAddress } from '@/domain/gym/application/utils/concat-address'
import { StudentAlreadyExistsError } from '@/domain/gym/application/use-cases/errors/student-already-exists-error'
import { PermissionDeniedError } from '@/domain/gym/application/use-cases/errors/permission-denied-error'

const createStudentBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  phone: z.string(),
  city: z.string(),
  state: z.string(),
  street: z.string(),
  number: z.coerce.number(),
  zipCode: z.string(),
  birthday: z.date(),
  hasMedicalRestriction: z.boolean(),
  medicalRestrictionDescription: z.string().nullable(),
  gender: z.enum(['MALE', 'FEMALE']),
  planId: z.coerce.number(),
})

const bodyValidationPipe = new ZodValidationPipe(createStudentBodySchema)

type CreateStudentBodySchema = z.infer<typeof createStudentBodySchema>

@Controller('/students')
export class RegisterStudentController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateStudentBodySchema) {
    const {
      name,
      cpf,
      email,
      phone,
      city,
      number,
      state,
      street,
      zipCode,
      birthday,
      hasMedicalRestriction,
      medicalRestrictionDescription,
      gender,
      planId,
    } = body

    const address = concatAddress({ city, number, state, street, zipCode })

    const result = await this.registerStudent.execute({
      address,
      birthday,
      cpf,
      email,
      gender,
      hasMedicalRestriction,
      name,
      phone,
      planId,
      medicalRestrictionDescription,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        case PermissionDeniedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
