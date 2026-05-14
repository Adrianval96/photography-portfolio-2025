export type Currency = 'AUD' | 'EUR'

export const EUROZONE = new Set([
  'AT',
  'BE',
  'CY',
  'DE',
  'EE',
  'ES',
  'FI',
  'FR',
  'GR',
  'HR',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PT',
  'SI',
  'SK',
])

export function snapToValidPrice(rawPrice: number): number {
  return Math.floor(rawPrice) + 0.99
}

export function formatPrice(audPrice: number, currency: Currency, audToEurRate: number): string {
  if (currency === 'AUD') return `A$${audPrice.toFixed(2)}`

  const rawEurPrice = audPrice * audToEurRate
  const snappedEurPrice = snapToValidPrice(rawEurPrice)
  return `€${snappedEurPrice.toFixed(2)}`
}
