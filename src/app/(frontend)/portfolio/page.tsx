import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Media } from '@/components/Media'
import type { Media as MediaType, PortfolioItem } from '@/payload-types'

import './styles.css'

export const metadata: Metadata = {
  title: 'Portfolio',
}

export default async function PortfolioPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: items } = await payload.find({
    collection: 'portfolio-items',
    limit: 300,
    pagination: false,
    overrideAccess: false,
    select: {
      title: true,
      media: true,
      location: true,
      slug: true,
    },
  })

  return (
    <div className="pt-16 pb-24">
      <div className="portfolio-grid">
        {items.map((item) => {
          if (!item.media || typeof item.media === 'number') return null
          const media = item.media as MediaType

          return (
            <div key={item.id} className="portfolio-item">
              <Media resource={media} imgClassName="portfolio-image" />
              {(item.title || item.location) && (
                <div className="portfolio-item-overlay">
                  {item.title && <p className="portfolio-item-title">{item.title}</p>}
                  {item.location && <p className="portfolio-item-location">{item.location}</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
