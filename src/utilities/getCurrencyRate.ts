import { unstable_cache } from 'next/cache'

// Conservative AUD → EUR mid-rate. Review and update quarterly when the shop is live.
// Only used when the frankfurter.app fetch fails (network outage, rate limit, etc.).
const FALLBACK_RATE = 0.58

type CurrencyRateResult = {
  audToEur: number
  stale: boolean
}

async function fetchAudToEurRate(): Promise<CurrencyRateResult> {
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=AUD&to=EUR')
    if (!response.ok) {
      return { audToEur: FALLBACK_RATE, stale: true }
    }
    const data = await response.json()
    const audToEurRate: number = data.rates.EUR
    return { audToEur: audToEurRate, stale: false }
  } catch {
    return { audToEur: FALLBACK_RATE, stale: true }
  }
}

export const getCurrencyRate = unstable_cache(fetchAudToEurRate, ['currency-rate'], {
  revalidate: 86400,
})
