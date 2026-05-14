'use client'

import React, { createContext, useContext, useSyncExternalStore } from 'react'

import type { Currency } from '@/utilities/currency'

const PREFERRED_CURRENCY_KEY = 'preferred-currency'

type CurrencyContextValue = {
  currency: Currency
  setCurrency: (currency: Currency) => void
  rate: number
  stale: boolean
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

type CurrencyProviderProps = {
  children: React.ReactNode
  defaultCurrency: Currency
  rate: number
  stale: boolean
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function getStoredCurrency(): Currency | null {
  const stored = localStorage.getItem(PREFERRED_CURRENCY_KEY)
  return stored === 'AUD' || stored === 'EUR' ? stored : null
}

export function CurrencyProvider({
  children,
  defaultCurrency,
  rate,
  stale,
}: CurrencyProviderProps) {
  const currency = useSyncExternalStore(
    subscribe,
    () => getStoredCurrency() ?? defaultCurrency,
    () => defaultCurrency,
  )

  function setCurrency(next: Currency) {
    localStorage.setItem(PREFERRED_CURRENCY_KEY, next)
    window.dispatchEvent(new StorageEvent('storage', { key: PREFERRED_CURRENCY_KEY, newValue: next }))
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rate, stale }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider')
  return context
}
