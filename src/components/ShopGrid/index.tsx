import Image from 'next/image'
import type { PrintProduct } from '@/services/printful'
import '@/components/ShopGrid/styles.css'

function PrintCard({ product }: { product: PrintProduct }) {
  return (
    <article className="print-card">
      <div className="print-card__image">
        <span className="print-card__badge">Edition of 50</span>
        {product.thumbnailUrl && (
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="print-card__img"
          />
        )}
      </div>
      <div className="print-card__info">
        <div className="print-card__meta">
          <p className="print-card__title">{product.title}</p>
          <p className="print-card__price">
            {product.price.toFixed(2)} {product.currency}
          </p>
        </div>
        {product.location && <p className="print-card__location">{product.location}</p>}
        <p className="print-card__cta">View print →</p>
      </div>
    </article>
  )
}

interface ShopGridProps {
  products: PrintProduct[]
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

      <nav className="shop-filter" aria-label="Browse by format">
        <button className="shop-filter__pill shop-filter__pill--active">All</button>
        <button className="shop-filter__pill">Portrait</button>
        <button className="shop-filter__pill">Landscape</button>
        <button className="shop-filter__pill">Cinema</button>
      </nav>

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
