import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/cache', () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}))

import { getCurrencyRate } from '@/lib/getCurrencyRate'

const EXPECTED_FALLBACK_RATE = 0.58

describe('getCurrencyRate', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the live AUD→EUR rate and stale: false on a successful fetch', async () => {
    const liveRate = 0.59
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ rates: { EUR: liveRate } }),
      }),
    )

    const result = await getCurrencyRate()

    expect(result.stale).toBe(false)
    expect(result.audToEur).toBe(liveRate)
  })

  it('returns a rate in the expected AUD→EUR range on a successful fetch', async () => {
    const liveRate = 0.59
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ rates: { EUR: liveRate } }),
      }),
    )

    const result = await getCurrencyRate()

    expect(result.audToEur).toBeGreaterThan(0.4)
    expect(result.audToEur).toBeLessThan(0.7)
  })

  it('returns the fallback rate and stale: true when fetch throws a network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ETIMEDOUT')))

    const result = await getCurrencyRate()

    expect(result.stale).toBe(true)
    expect(result.audToEur).toBe(EXPECTED_FALLBACK_RATE)
  })

  it('returns the fallback rate and stale: true when the API returns a non-OK response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      }),
    )

    const result = await getCurrencyRate()

    expect(result.stale).toBe(true)
    expect(result.audToEur).toBe(EXPECTED_FALLBACK_RATE)
  })
})
