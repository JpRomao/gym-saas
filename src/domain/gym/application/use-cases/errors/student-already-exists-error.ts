import { UseCaseError } from '@/core/errors/use-case-error'

export class StudentAlreadyExistsError extends Error implements UseCaseError {
  constructor(studentIdentifier: string, gymId: string) {
    super(
      `Student already exists at this gym. student: [${studentIdentifier}] | gym_id[${gymId}]`,
    )
  }
}
