import { EmployeeRepository } from '@/domain/gym/application/repositories/employee-repository'
import { Employee } from '@/domain/gym/enterprise/entities/employee'

export class InMemoryEmployeeRepository extends EmployeeRepository {
  public items: Employee[] = []

  async findById(id: string): Promise<Employee | null> {
    return this.items.find((employee) => employee.id.toString() === id) || null
  }

  async findByCpf(cpf: string): Promise<Employee | null> {
    return this.items.find((employee) => employee.cpf === cpf) || null
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return this.items.find((employee) => employee.email === email) || null
  }

  async create(employee: Employee): Promise<void> {
    this.items.push(employee)
  }

  async save(employee: Employee): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(employee.id))

    this.items[index] = employee
  }
}
