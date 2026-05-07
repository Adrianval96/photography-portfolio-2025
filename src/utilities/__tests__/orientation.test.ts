import { describe, it, expect } from 'vitest'
import { getOrientation, getOrientationFromDimensions } from '@/utilities/orientation'

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
})

describe('getOrientationFromDimensions', () => {
  it('returns portrait when height exceeds width', () => {
    expect(getOrientationFromDimensions(600, 900)).toBe('portrait')
  })

  it('returns landscape when width exceeds height', () => {
    expect(getOrientationFromDimensions(1200, 800)).toBe('landscape')
  })

  it('returns square when width equals height', () => {
    expect(getOrientationFromDimensions(800, 800)).toBe('square')
  })
})
