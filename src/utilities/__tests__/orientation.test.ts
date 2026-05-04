import { describe, it, expect } from 'vitest'
import { getOrientation } from '@/utilities/orientation'

describe('getOrientation', () => {
  it('returns portrait when height exceeds width', () => {
    expect(getOrientation({ width: 600, height: 900 })).toBe('portrait')
  })

  it('returns landscape when width exceeds height', () => {
    expect(getOrientation({ width: 1200, height: 800 })).toBe('landscape')
  })

  it('returns square when width equals height', () => {
    expect(getOrientation({ width: 800, height: 800 })).toBe('square')
  })

  it('handles 1×1 as square', () => {
    expect(getOrientation({ width: 1, height: 1 })).toBe('square')
  })

  it('handles very wide landscape ratios', () => {
    expect(getOrientation({ width: 3000, height: 200 })).toBe('landscape')
  })

  it('handles very tall portrait ratios', () => {
    expect(getOrientation({ width: 200, height: 3000 })).toBe('portrait')
  })
})
