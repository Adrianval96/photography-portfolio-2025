'use client'

import { useCurrency } from '@/context/CurrencyContext'
import type { Currency } from '@/utilities/currency'

import '@/components/CurrencyToggle/styles.css'

export function CurrencyToggle() {
  const { currency, setCurrency, isStale } = useCurrency()

  return (
    <div className="currency-toggle" role="group" aria-label="Currency">
      <CurrencyToggleButton label="AUD" active={currency === 'AUD'} onSelect={setCurrency} />
      <span className="currency-toggle__sep" aria-hidden="true">|</span>
      <CurrencyToggleButton
        label="EUR"
        active={currency === 'EUR'}
        onSelect={setCurrency}
        staleSuffix={isStale}
      />
    </div>
  )
}

function CurrencyToggleButton({
  label,
  active,
  onSelect,
  staleSuffix = false,
}: {
  label: Currency
  active: boolean
  onSelect: (c: Currency) => void
  staleSuffix?: boolean
}) {
  return (
    <button
      className={`currency-toggle__btn${active ? ' currency-toggle__btn--active' : ''}`}
      onClick={() => onSelect(label)}
      aria-pressed={active}
    >
      {label}
      {staleSuffix && <span className="currency-toggle__stale"> (~rate)</span>}
    </button>
  )
}
