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

export function SelectedWork({ items }: Props) {
  const sorted = [...items].sort((a, b) => {
    const aMedia = typeof a.media === 'object' ? a.media : null
    const bMedia = typeof b.media === 'object' ? b.media : null
    const aLandscape = aMedia ? isLandscape(aMedia) : true
    const bLandscape = bMedia ? isLandscape(bMedia) : true
    if (aLandscape === bLandscape) return 0
    return aLandscape ? -1 : 1
  })

  return (
    <section className="selected-work">
      <header className="selected-work__header">
        <span className="selected-work__label">Selected Work</span>
        <Link href="/portfolio" className="selected-work__link">
          See the full portfolio →
        </Link>
      </header>
      <div className="selected-work__grid">
        {sorted.map((item) => {
          const media = typeof item.media === 'object' ? item.media : null
          const landscape = media ? isLandscape(media) : true
          return (
            <div
              key={item.id}
              className={`selected-work__item selected-work__item--${landscape ? 'landscape' : 'portrait'}`}
            >
              {media && (
                <MediaComponent
                  fill
                  resource={media}
                  imgClassName="selected-work__image"
                  pictureClassName="selected-work__picture"
                />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
