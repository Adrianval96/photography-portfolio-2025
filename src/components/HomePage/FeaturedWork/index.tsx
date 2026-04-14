import type { PortfolioItem, Media } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'
import Link from 'next/link'
import './styles.css'

type Props = {
  items: PortfolioItem[]
}

function resolveMedia(item: PortfolioItem): Media | null {
  return typeof item.media === 'object' ? item.media : null
}

export function FeaturedWork({ items }: Props) {
  return (
    <section className="featured-work">
      <header className="featured-work__header">
        <span className="featured-work__label">Featured Work</span>
        <Link href="/portfolio" className="featured-work__link">
          See the full portfolio →
        </Link>
      </header>
      <div className="featured-work__grid">
        {items.map((item) => {
          const media = resolveMedia(item)
          return (
            <div key={item.id} className="featured-work__item">
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
