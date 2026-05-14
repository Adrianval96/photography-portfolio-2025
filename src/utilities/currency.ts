export type Currency = 'AUD' | 'EUR'

const ROUNDING_THRESHOLD_HIGH = 0.66
const ROUNDING_THRESHOLD_MID = 0.33
const CENTS_HIGH = 0.99
const CENTS_MID = 0.95

export function snapToValidPrice(rawPrice: number): number {
  const wholePart = Math.floor(rawPrice)
  const fractionalPart = rawPrice - wholePart

  if (fractionalPart > ROUNDING_THRESHOLD_HIGH) return wholePart + CENTS_HIGH
  if (fractionalPart > ROUNDING_THRESHOLD_MID) return wholePart + CENTS_MID
  return wholePart
}

export function formatPrice(audPrice: number, currency: Currency, audToEurRate: number): string {
  if (currency === 'AUD') return `A$${audPrice.toFixed(2)}`

  const rawEurPrice = audPrice * audToEurRate
  const snappedEurPrice = snapToValidPrice(rawEurPrice)
  return `€${snappedEurPrice.toFixed(2)}`
}
