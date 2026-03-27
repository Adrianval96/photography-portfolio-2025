'use client'

import { Media } from '@/components/Media'
import type { Category, Media as MediaType, PortfolioItem } from '@/payload-types'
import './styles.css'

type Props = {
  item: PortfolioItem
}

export function PortfolioItemCard({ item }: Props) {
  if (!item.media || typeof item.media === 'number') return null
  const media = item.media as MediaType
  const category = item.categories?.find((cat) => typeof cat !== 'number') as
    | Category
    | undefined

  return (
    <div className="portfolio-item">
      <Media resource={media} imgClassName="portfolio-item__image" />
      {(item.title || item.location || category) && (
        <div className="portfolio-item__overlay">
          {item.title && <p className="portfolio-item__title">{item.title}</p>}
          {item.location && <p className="portfolio-item__location">{item.location}</p>}
          {category && <p className="portfolio-item__category">{category.name}</p>}
        </div>
      )}
    </div>
  )
}
