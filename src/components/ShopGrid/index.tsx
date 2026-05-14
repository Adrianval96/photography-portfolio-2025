import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/payload-types'
import { getOrientationFromDimensions } from '@/utilities/orientation'
import { groupByCollection } from '@/utilities/shop'
import type { ProductGroup } from '@/utilities/shop'
import { CurrencyPriceDisplay } from '@/components/CurrencyPriceDisplay'
import { CurrencyToggle } from '@/components/CurrencyToggle'
import '@/components/ShopGrid/styles.css'

function PrintCard({ product }: { product: Product }) {
  const price = product.variants?.[0]?.price
  const primaryImage = product.productImages?.[0]
  const imageWidth = primaryImage?.width ?? 0
  const imageHeight = primaryImage?.height ?? 0
  const orientation = getOrientationFromDimensions(imageWidth, imageHeight)

  return (
    <Link href={`/shop/${product.slug}`} className={`print-card print-card--${orientation}`}>
      <div className={`print-card__image print-card__image--${orientation}`}>
        {primaryImage?.url && (
          <Image
            src={primaryImage.url}
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
          {price !== undefined && (
              <p className="print-card__price">
                <CurrencyPriceDisplay audPrice={price} />
              </p>
            )}
        </div>
        <p className="print-card__cta">View print →</p>
      </div>
    </Link>
  )
}

function SizeSection({ group }: { group: ProductGroup }) {
  return (
    <div className="size-section">
      {group.label && (
        <div className="size-separator">
          <span className="size-separator__label">{group.label}</span>
          <span className="size-separator__count">
            {group.products.length} {group.products.length === 1 ? 'print' : 'prints'}
          </span>
        </div>
      )}
      <div className="shop-grid">
        {group.products.map((product) => (
          <PrintCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

interface ShopGridProps {
  products: Product[]
}

export function ShopGrid({ products }: ShopGridProps) {
  const productGroups = groupByCollection(products)

  return (
    <div className="shop-grid-wrap">
      <header className="shop-hero">
        <div className="shop-hero__label-row">
          <span className="shop-hero__label">Prints</span>
          <CurrencyToggle />
        </div>
        <h1 className="shop-hero__title">Take a piece home.</h1>
        <p className="shop-hero__subtitle">
          Edition prints on fine-art paper — every piece made to order.
        </p>
      </header>

      {productGroups.length > 0 ? (
        <div className="shop-sections">
          {productGroups.map((group) => (
            <SizeSection key={group.label} group={group} />
          ))}
        </div>
      ) : (
        <p className="shop-empty">No prints available at the moment.</p>
      )}
    </div>
  )
}
