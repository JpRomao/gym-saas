import { faker } from '@faker-js/faker'

export function generateAddress(): string {
  const city = faker.location.city()
  const state = faker.location.state()
  const street = faker.location.streetAddress()
  const zip = faker.location.zipCode()

  const address = city + ', ' + state + ', ' + street + ', ' + zip

  return address
}
