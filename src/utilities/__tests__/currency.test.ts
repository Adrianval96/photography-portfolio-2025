import { describe, it, expect } from 'vitest'
import { snapToValidPrice, formatPrice } from '@/utilities/currency'

describe('snapToValidPrice', () => {
  it('returns a whole integer when the fractional part is at or below 0.33', () => {
    expect(snapToValidPrice(55.1)).toBe(55)
    expect(snapToValidPrice(55.33)).toBe(55)
  })

  it('returns .95 when the fractional part is above 0.33 and at or below 0.66', () => {
    expect(snapToValidPrice(55.34)).toBe(55.95)
    expect(snapToValidPrice(55.5)).toBe(55.95)
    expect(snapToValidPrice(55.66)).toBe(55.95)
  })

  it('returns .99 when the fractional part is above 0.66', () => {
    expect(snapToValidPrice(55.67)).toBe(55.99)
    expect(snapToValidPrice(55.9)).toBe(55.99)
    expect(snapToValidPrice(55.999)).toBe(55.99)
  })

  it('returns the whole integer unchanged when the input is already a whole number', () => {
    expect(snapToValidPrice(50)).toBe(50)
    expect(snapToValidPrice(100)).toBe(100)
  })
})

describe('formatPrice', () => {
  describe('AUD passthrough', () => {
    it('returns the AUD price with A$ prefix and two decimal places', () => {
      expect(formatPrice(95, 'AUD', 0.58)).toBe('A$95.00')
      expect(formatPrice(120, 'AUD', 0.58)).toBe('A$120.00')
    })

    it('does not apply any conversion or rounding for AUD', () => {
      expect(formatPrice(55.5, 'AUD', 0.58)).toBe('A$55.50')
    })
  })

  describe('EUR conversion', () => {
    it('converts AUD to EUR using the provided rate and formats with € prefix', () => {
      // 95 × 0.58 = 55.1 → frac 0.1 ≤ 0.33 → floor → 55.00
      expect(formatPrice(95, 'EUR', 0.58)).toBe('€55.00')
    })

    it('snaps fractional EUR price to .95 when fractional part is in the mid range', () => {
      // 100 × 0.585 = 58.5 → frac 0.5 > 0.33 and ≤ 0.66 → 58.95
      expect(formatPrice(100, 'EUR', 0.585)).toBe('€58.95')
    })

    it('snaps fractional EUR price to .99 when fractional part is above 0.66', () => {
      // 100 × 0.587 = 58.7 → frac 0.7 > 0.66 → 58.99
      expect(formatPrice(100, 'EUR', 0.587)).toBe('€58.99')
    })

    it('handles a whole-number EUR result with two decimal places', () => {
      // 50 × 0.60 = 30.0 → frac 0 → floor → 30.00
      expect(formatPrice(50, 'EUR', 0.6)).toBe('€30.00')
    })
  })
})
