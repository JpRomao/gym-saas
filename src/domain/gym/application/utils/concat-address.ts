interface Address {
  street: string
  number: number
  city: string
  state: string
  zip: string
}

export function concatAddress({
  street,
  number,
  city,
  state,
  zip,
}: Address): string {
  return `${street}, ${number} - ${city}, ${state} - ${zip}`
}
