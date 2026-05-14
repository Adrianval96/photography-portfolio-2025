import { describe, it, expect } from 'vitest'
import { formatPrice } from '@/utilities/currency'

describe('formatPrice', () => {
  it('returns the AUD price with A$ prefix and two decimal places, no conversion', () => {
    expect(formatPrice(95, 'AUD', 0.58)).toBe('A$95.00')
    expect(formatPrice(120, 'AUD', 0.58)).toBe('A$120.00')
  })

  it('converts AUD to EUR and snaps to .99 cents', () => {
    // 95 × 0.58 = 55.1 → floor 55 → 55.99
    expect(formatPrice(95, 'EUR', 0.58)).toBe('€55.99')
  })

  it('always snaps to .99 regardless of the fractional part of the converted price', () => {
    // 100 × 0.585 = 58.5 → floor 58 → 58.99
    expect(formatPrice(100, 'EUR', 0.585)).toBe('€58.99')
    // 100 × 0.587 = 58.7 → floor 58 → 58.99
    expect(formatPrice(100, 'EUR', 0.587)).toBe('€58.99')
    // 50 × 0.6 = 30.0 → floor 30 → 30.99
    expect(formatPrice(50, 'EUR', 0.6)).toBe('€30.99')
  })
})
