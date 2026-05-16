import React from 'react'

import { CartProvider } from '@/context/CartContext'
import { CurrencyProvider } from '@/context/CurrencyContext'
import type { Currency } from '@/utilities/currency'
import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

type ProvidersProps = {
  children: React.ReactNode
  defaultCurrency: Currency
  currencyRate: number
  currencyRateStale: boolean
}

export const Providers: React.FC<ProvidersProps> = ({
  children,
  defaultCurrency,
  currencyRate,
  currencyRateStale,
}) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <CurrencyProvider
          defaultCurrency={defaultCurrency}
          rate={currencyRate}
          isStale={currencyRateStale}
        >
          <CartProvider>{children}</CartProvider>
        </CurrencyProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
