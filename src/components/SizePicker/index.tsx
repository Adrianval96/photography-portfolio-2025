'use client'

import { useState } from 'react'
import { CurrencyPriceDisplay } from '@/components/CurrencyPriceDisplay'
import '@/components/SizePicker/styles.css'

interface SizeVariant {
  printfulVariantId: number
  format: string
  price: number
}

interface SizePickerProps {
  variants: SizeVariant[]
}

export function SizePicker({ variants }: SizePickerProps) {
  const sortedVariants = [...variants].sort((a, b) => a.price - b.price)
  const cheapestVariant = sortedVariants[0] ?? null
  const [activeVariantId, setActiveVariantId] = useState<number | null>(
    cheapestVariant?.printfulVariantId ?? null,
  )

  const activeVariant =
    sortedVariants.find((v) => v.printfulVariantId === activeVariantId) ?? cheapestVariant

  if (!activeVariant) return null

  const showPills = sortedVariants.length > 1

  return (
    <div className="size-picker">
      {showPills && (
        <div className="size-picker__pills">
          {sortedVariants.map((variant) => {
            const isActive = variant.printfulVariantId === activeVariantId
            return (
              <button
                key={variant.printfulVariantId}
                type="button"
                className={`size-picker__pill${isActive ? ' size-picker__pill--active' : ''}`}
                onClick={() => setActiveVariantId(variant.printfulVariantId)}
              >
                {variant.format}
              </button>
            )
          })}
        </div>
      )}
      <p className="size-picker__price">
        <CurrencyPriceDisplay audPrice={activeVariant.price} />
      </p>
    </div>
  )
}
