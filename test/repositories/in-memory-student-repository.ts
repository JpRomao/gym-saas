import { StudentRepository } from '@/domain/gym/application/repositories/student-repository'
import { Student } from '@/domain/gym/enterprise/entities/student'

export class InMemoryStudentRepository implements StudentRepository {
  public items: Student[] = []

  async findById(id: string): Promise<Student | null> {
    return this.items.find((student) => student.id.toString() === id) || null
  }

  async findByCpfAndGymId(cpf: string, gymId: string): Promise<Student | null> {
    return (
      this.items.find(
        (student) => student.cpf === cpf && student.gymId.toString() === gymId,
      ) || null
    )
  }

  async create(student: Student): Promise<void> {
    this.items.push(student)
  }

  async save(student: Student): Promise<void> {
    const studentIndex = this.items.findIndex(
      (studentItem) => studentItem.id === student.id,
    )

    this.items[studentIndex] = student
  }
}
