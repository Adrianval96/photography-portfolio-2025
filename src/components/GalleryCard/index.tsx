import { Media } from '@/components/Media'
import type { Category, Media as MediaType, PortfolioItem } from '@/payload-types'
import './styles.css'

type Props = {
  item: PortfolioItem
  onOpen: () => void
}

export function GalleryCard({ item, onOpen }: Props) {
  if (!item.media || typeof item.media === 'number') return null
  const media = item.media as MediaType
  const category = item.categories?.find((cat) => typeof cat !== 'number') as
    | Category
    | undefined

  return (
    <div className="gallery-card" onClick={onOpen} role="button" tabIndex={0}>
      <Media resource={media} imgClassName="gallery-card__image" />
      {(item.title || item.location || category) && (
        <div className="gallery-card__overlay">
          {item.title && <p className="gallery-card__title">{item.title}</p>}
          {item.location && <p className="gallery-card__location">{item.location}</p>}
          {category && <p className="gallery-card__category">{category.name}</p>}
        </div>
      )}
    </div>
  )
}
