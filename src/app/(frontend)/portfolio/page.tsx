import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { GalleryGrid } from '@/components/GalleryGrid'
import { CACHE_TAG_PORTFOLIO_ITEMS } from '@/collections/PortfolioItems/hooks/revalidatePortfolioItems'
import { REVALIDATE_SECONDS } from '@/constants'

export const metadata: Metadata = {
  title: 'Portfolio',
}

const getCachedPortfolioData = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })

    return Promise.all([
      payload.find({
        collection: 'portfolio-items',
        limit: 300,
        pagination: false,
        overrideAccess: false,
        depth: 1,
      }),
      payload.find({
        collection: 'categories',
        limit: 100,
        pagination: false,
      }),
    ])
  },
  ['portfolio-page'],
  {
    tags: [CACHE_TAG_PORTFOLIO_ITEMS],
    revalidate: REVALIDATE_SECONDS,
  },
)

export default async function PortfolioPage() {
  const [{ docs: items }, { docs: categories }] = await getCachedPortfolioData()

  return (
    <div className="pt-16">
      <GalleryGrid items={items} categories={categories} />
    </div>
  )
}
