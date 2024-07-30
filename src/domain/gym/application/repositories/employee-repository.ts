import { Employee } from './../../enterprise/entities/employee'

export abstract class EmployeeRepository {
  abstract create(employee: Employee): Promise<void>
  abstract findByCpf(cpf: string): Promise<Employee | null>
  abstract findById(id: string): Promise<Employee | null>
  abstract save(employee: Employee): Promise<void>
}
