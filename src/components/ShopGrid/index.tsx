import Image from 'next/image'
import type { PrintProduct, PrintSection } from '@/services/printful'
import '@/components/ShopGrid/styles.css'

function PrintCard({ product }: { product: PrintProduct }) {
  return (
    <article className="print-card">
      <div className={`print-card__image print-card__image--${product.format}`}>
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
        <p className="print-card__title">{product.title}</p>
        {product.location && <p className="print-card__location">{product.location}</p>}
        <p className="print-card__price">
          {product.price.toFixed(2)} {product.currency}
        </p>
      </div>
    </article>
  )
}

interface ShopGridProps {
  sections: PrintSection[]
}

export function ShopGrid({ sections }: ShopGridProps) {
  const visibleSections = sections.filter((s) => s.products.length > 0)

  return (
    <div className="shop-grid-wrap">
      <header className="shop-hero">
        <span className="shop-hero__label">Prints</span>
        <h1 className="shop-hero__title">Take a piece home.</h1>
        <p className="shop-hero__subtitle">
          Edition prints on fine-art paper — every piece made to order.
        </p>
      </header>

      <div className="shop-sections">
        {visibleSections.map((section) => (
          <section key={section.format} className="shop-section">
            <div className="shop-section__header">
              <span className="shop-section__format">{section.label}</span>
              <span className="shop-section__dims">{section.dims}</span>
            </div>
            <div className="shop-grid">
              {section.products.map((product) => (
                <PrintCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}

        {visibleSections.length === 0 && (
          <p className="shop-empty">No prints available at the moment.</p>
        )}
      </div>
    </div>
  )
}
