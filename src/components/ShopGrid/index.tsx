import Image from 'next/image'
import type { Product } from '@/payload-types'
import '@/components/ShopGrid/styles.css'

function parseName(name: string): { title: string; location: string } {
  const sep = name.indexOf(' | ')
  if (sep !== -1) return { title: name.slice(0, sep).trim(), location: name.slice(sep + 3).trim() }
  return { title: name.trim(), location: '' }
}

function cheapestPrice(variants: Product['variants']): number | null {
  if (!variants?.length) return null
  return variants.reduce<number | null>((min, v) => {
    if (min === null || v.price < min) return v.price
    return min
  }, null)
}

function formatIsLandscape(format: string): boolean {
  const match = format.match(/(\d+)[^×]*×[^×]*?(\d+)/)
  if (!match) return false
  return Number(match[1]) > Number(match[2])
}

function PrintCard({ product }: { product: Product }) {
  const { title, location } = parseName(product.name)
  const price = cheapestPrice(product.variants)
  const isLandscape = formatIsLandscape(product.variants?.[0]?.format ?? '')
  const imageClass = `print-card__image${isLandscape ? ' print-card__image--landscape' : ' print-card__image--portrait'}`

  return (
    <article className="print-card">
      <div className={imageClass}>
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={title}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            className="print-card__img"
          />
        )}
      </div>
      <div className="print-card__info">
        <div className="print-card__meta">
          <p className="print-card__title">{title}</p>
          {price !== null && (
            <p className="print-card__price">
              {price.toFixed(2)} AUD
            </p>
          )}
        </div>
        {location && <p className="print-card__location">{location}</p>}
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
