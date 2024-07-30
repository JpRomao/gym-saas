import { Either, left, right } from '@/core/either'
import { Plan } from '../../enterprise/entities/plan'
import { PlanRepository } from '../repositories/plan-repository'
import { GymNotFoundError } from './errors/gym-not-found-error'
import { GymRepository } from '../repositories/gym-repository'
import { EmployeeRepository } from '../repositories/employee-repository'
import { EmployeeNotFoundError } from './errors/employee-not-found-error'
import { PermissionDeniedError } from './errors/permission-denied-error'
import { EmployeeRoles } from '../../enterprise/entities/employee'

interface CreatePlanRequest {
  name: string
  duration: number
  price: number
  discount: number | null
  gymId: string
  employeeId: string
}

type CreatePlanResponse = Either<
  GymNotFoundError,
  {
    plan: Plan
  }
>

export class CreatePlanUseCase {
  constructor(
    private planRepository: PlanRepository,
    private gymRepository: GymRepository,
    private employeeRepository: EmployeeRepository,
  ) {}

  async execute({
    discount,
    duration,
    gymId,
    employeeId,
    name,
    price,
  }: CreatePlanRequest): Promise<CreatePlanResponse> {
    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      return left(new GymNotFoundError(gymId))
    }

    const employee = await this.employeeRepository.findById(employeeId)

    if (!employee) {
      return left(new EmployeeNotFoundError(employeeId))
    }

    if (employee.gymId.toString() !== gymId) {
      return left(
        new PermissionDeniedError(
          employeeId,
          `Employee [${employee.name}] does not work at gym [${gymId}]`,
        ),
      )
    }

    if (employee.role !== EmployeeRoles.ADMIN) {
      return left(
        new PermissionDeniedError(
          employeeId,
          `Employee [${employee.name}] does not have permission to create plans`,
        ),
      )
    }

    const plan = Plan.create({ discount, duration, gymId, name, price })

    await this.planRepository.create(plan)

    return right({ plan })
  }
}
