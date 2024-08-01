import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

import { CreateEmployeeUseCase } from '@/domain/gym/application/use-cases/create-employee'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { concatAddress } from '@/domain/gym/application/utils/concat-address'

const createEmployeeBodySchema = z.object({
  gymId: z.string(),
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  phone: z.string(),
  password: z.string(),
  city: z.string(),
  state: z.string(),
  street: z.string(),
  number: z.string(),
  zipCode: z.string(),
  role: z.enum(['WORKER', 'RELATIONED', 'MANAGER']),
})

const bodyValidationPipe = new ZodValidationPipe(createEmployeeBodySchema)

type CreateEmployeeBodySchema = z.infer<typeof createEmployeeBodySchema>

@Controller('/employee')
export class CreateEmployeeController {
  constructor(private createEmployee: CreateEmployeeUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateEmployeeBodySchema) {
    const {
      gymId,
      name,
      cpf,
      email,
      phone,
      password,
      role,
      city,
      number,
      state,
      street,
      zipCode,
    } = body

    const address = concatAddress({ city, number, state, street, zipCode })

    await this.createEmployee.execute({
      gymId,
      name,
      cpf,
      email,
      phone,
      password,
      role,
      address,
    })
  }
}
