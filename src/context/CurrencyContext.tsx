'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

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

export function CurrencyProvider({ children, defaultCurrency, rate, stale }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(defaultCurrency)

  useEffect(() => {
    const stored = localStorage.getItem(PREFERRED_CURRENCY_KEY) as Currency | null
    if (stored === 'AUD' || stored === 'EUR') {
      setCurrencyState(stored)
    }
  }, [])

  function setCurrency(next: Currency) {
    setCurrencyState(next)
    localStorage.setItem(PREFERRED_CURRENCY_KEY, next)
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
