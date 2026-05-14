'use client'

import { useCurrency } from '@/context/CurrencyContext'
import { formatPrice } from '@/utilities/currency'

import '@/components/CurrencyPriceDisplay/styles.css'

export function CurrencyPriceDisplay({ audPrice }: { audPrice: number }) {
  const { currency, rate } = useCurrency()
  return <span className="currency-price-display">{formatPrice(audPrice, currency, rate)}</span>
}
