import { Employee } from '../../enterprise/entities/employee'
import { Owner } from '../../enterprise/entities/owner'
import { EmployeeRepository } from '../repositories/employee-repository'
import { OwnerRepository } from '../repositories/owner-repository'
import { PermissionDeniedError } from '../use-cases/errors/permission-denied-error'

export async function findManager(
  managerId: string,
  employeeRepository: EmployeeRepository,
  ownerRepository: OwnerRepository,
) {
  let manager: Employee | Owner | null =
    await employeeRepository.findById(managerId)

  if (manager && manager.role !== 'MANAGER') {
    return new PermissionDeniedError()
  }

  if (!manager) {
    manager = await ownerRepository.findById(managerId)
  }

  return manager
}
