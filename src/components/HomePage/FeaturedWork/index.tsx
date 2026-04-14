import type { PortfolioItem, Media } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'
import Link from 'next/link'
import './styles.css'

type Props = {
  items: PortfolioItem[]
}

function isLandscape(media: Media): boolean {
  const { width, height } = media
  return !width || !height || width >= height
}

function resolveMedia(item: PortfolioItem): Media | null {
  return typeof item.media === 'object' ? item.media : null
}

function sortPortraitFirst(items: PortfolioItem[]): PortfolioItem[] {
  return [...items].sort((a, b) => {
    const aLandscape = isLandscape(resolveMedia(a) ?? ({} as Media))
    const bLandscape = isLandscape(resolveMedia(b) ?? ({} as Media))
    if (aLandscape === bLandscape) return 0
    return aLandscape ? 1 : -1
  })
}

export function FeaturedWork({ items }: Props) {
  const sorted = sortPortraitFirst(items)

  return (
    <section className="featured-work">
      <header className="featured-work__header">
        <span className="featured-work__label">Featured Work</span>
        <Link href="/portfolio" className="featured-work__link">
          See the full portfolio →
        </Link>
      </header>
      <div className="featured-work__grid">
        {sorted.map((item) => {
          const media = resolveMedia(item)
          const orientation = media && isLandscape(media) ? 'landscape' : 'portrait'
          return (
            <div
              key={item.id}
              className={`featured-work__item featured-work__item--${orientation}`}
            >
              {media && (
                <MediaComponent
                  fill
                  resource={media}
                  imgClassName="featured-work__image"
                  pictureClassName="featured-work__picture"
                />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
