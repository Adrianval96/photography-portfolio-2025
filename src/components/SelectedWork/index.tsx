import Image from 'next/image'
import Link from 'next/link'
import type { Media, PortfolioItem } from '@/payload-types'
import styles from './index.module.css'

type Props = {
  items: PortfolioItem[]
}

const isLandscape = (media: Media) => {
  const width = media.width ?? 0
  const height = media.height ?? 0
  return width > height
}

export const SelectedWork: React.FC<Props> = ({ items }) => {
  const sorted = [...items].sort((a, b) => {
    const mediaA = typeof a.media === 'object' ? (a.media as Media) : null
    const mediaB = typeof b.media === 'object' ? (b.media as Media) : null
    const aLandscape = mediaA ? isLandscape(mediaA) : false
    const bLandscape = mediaB ? isLandscape(mediaB) : false
    if (aLandscape && !bLandscape) return -1
    if (!aLandscape && bLandscape) return 1
    return 0
  })

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>Selected Work</span>
        <Link href="/portfolio" className={styles.portfolioLink}>
          See the full portfolio →
        </Link>
      </div>
      <div className={styles.grid}>
        {sorted.map((item) => {
          const media = typeof item.media === 'object' ? (item.media as Media) : null
          if (!media?.url) return null

          const orientation = isLandscape(media) ? 'landscape' : 'portrait'
          const src = `${media.url}?${media.updatedAt}`

          return (
            <div key={item.id} className={styles.item} data-orientation={orientation}>
              <Image
                src={src}
                alt={media.alt || item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
