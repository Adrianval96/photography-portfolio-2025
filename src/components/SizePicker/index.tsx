'use client'

import { useState } from 'react'
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
  const firstVariant = variants[0] ?? null
  const [activeVariantId, setActiveVariantId] = useState<number | null>(
    firstVariant?.printfulVariantId ?? null,
  )

  const activeVariant =
    variants.find((v) => v.printfulVariantId === activeVariantId) ?? firstVariant

  if (!activeVariant) return null

  const showPills = variants.length > 1

  return (
    <div className="size-picker">
      {showPills && (
        <div className="size-picker__pills">
          {variants.map((variant) => {
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
      <p className="size-picker__price">AUD {activeVariant.price.toFixed(2)}</p>
    </div>
  )
}
