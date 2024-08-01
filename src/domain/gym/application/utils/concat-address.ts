interface Address {
  street: string
  number: string
  city: string
  state: string
  zipCode: string
}

export function concatAddress({
  street,
  number,
  city,
  state,
  zipCode,
}: Address): string {
  return `${street}, ${number} - ${city}, ${state} - ${zipCode}`
}