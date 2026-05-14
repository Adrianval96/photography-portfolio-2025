import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/payload-types'
import { getOrientationFromDimensions } from '@/utilities/orientation'
import { getCollectionName } from '@/utilities/shop'
import { SizePicker } from '@/components/SizePicker'
import '@/components/ProductDetail/styles.css'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const primaryImage = product.productImages?.[0] ?? null
  const firstVariant = product.variants?.[0] ?? null

  const imageWidth = primaryImage?.width ?? 0
  const imageHeight = primaryImage?.height ?? 0
  const orientation = getOrientationFromDimensions(imageWidth, imageHeight)

  const collectionName = firstVariant?.format ? getCollectionName(firstVariant.format) : null

  return (
    <div className={`product-detail product-detail--${orientation}`}>
      <div className={`product-detail__image-col product-detail__image-col--${orientation}`}>
        {primaryImage?.url && (
          <Image
            src={primaryImage.url}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 65vw"
            className="product-detail__image"
          />
        )}
        {/* SHOP-DL-09c: ProductGallery */}
      </div>

      <aside className="product-detail__info-col">
        <Link href="/shop" className="product-detail__back">
          ← Shop
        </Link>

        <div className="product-detail__meta">
          {collectionName && (
            <span className="product-detail__collection">{collectionName}</span>
          )}
          <h1 className="product-detail__title">{product.name}</h1>
          <SizePicker variants={product.variants ?? []} />
        </div>

        <button className="product-detail__cart-btn" type="button" disabled>
          Add to cart →
        </button>

        {firstVariant && (
          <dl className="product-detail__specs">
            <dt className="product-detail__spec-label">Format</dt>
            <dd className="product-detail__spec-value">{firstVariant.format}</dd>
            {collectionName && (
              <>
                <dt className="product-detail__spec-label">Collection</dt>
                <dd className="product-detail__spec-value">{collectionName}</dd>
              </>
            )}
          </dl>
        )}

        <p className="product-detail__shipping">
          Made to order — ships within 5–7 business days.
        </p>
      </aside>
    </div>
  )
}
