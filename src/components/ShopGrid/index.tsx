'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/payload-types'
import { getDimensionsFromImage, getOrientation, type Orientation } from '@/utilities/orientation'
import '@/components/ShopGrid/styles.css'

function PrintCard({ product }: { product: Product }) {
  const [orientation, setOrientation] = useState<Orientation>('portrait')
  const containerRef = useRef<HTMLDivElement>(null)
  const price = product.variants?.[0]?.price

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const img = container.querySelector('img')
    if (!img) return

    function applyOrientation() {
      const dimensions = getDimensionsFromImage(img as HTMLImageElement)
      if (dimensions.width > 0) {
        setOrientation(getOrientation(dimensions))
      }
    }

    if (img.complete && img.naturalWidth > 0) {
      applyOrientation()
      return
    }

    img.addEventListener('load', applyOrientation)
    return () => img.removeEventListener('load', applyOrientation)
  }, [])

  return (
    <article className="print-card">
      <div ref={containerRef} className={`print-card__image print-card__image--${orientation}`}>
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            className="print-card__img"
          />
        )}
      </div>
      <div className="print-card__info">
        <div className="print-card__meta">
          <p className="print-card__title">{product.name}</p>
          {price !== undefined && <p className="print-card__price">{price.toFixed(2)} AUD</p>}
        </div>
        <p className="print-card__cta">View print →</p>
      </div>
    </article>
  )
}

interface ShopGridProps {
  products: Product[]
}

export function ShopGrid({ products }: ShopGridProps) {
  return (
    <div className="shop-grid-wrap">
      <header className="shop-hero">
        <span className="shop-hero__label">Prints</span>
        <h1 className="shop-hero__title">Take a piece home.</h1>
        <p className="shop-hero__subtitle">
          Edition prints on fine-art paper — every piece made to order.
        </p>
      </header>

      {products.length > 0 ? (
        <div className="shop-grid">
          {products.map((product) => (
            <PrintCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="shop-empty">No prints available at the moment.</p>
      )}
    </div>
  )
}
