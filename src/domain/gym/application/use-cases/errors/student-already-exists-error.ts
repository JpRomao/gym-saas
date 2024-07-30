export class StudentAlreadyExistsError extends Error {
  constructor(studentIdentifier: string, gymId: string) {
    super(
      `Student already exists at this gym. student: [${studentIdentifier}] | gym_id[${gymId}]`,
    )
  }
}
