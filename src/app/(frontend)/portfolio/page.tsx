import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { GalleryGrid } from '@/components/GalleryGrid'
import { generateMeta } from '@/utilities/generateMeta'
import { CACHE_TAG_PORTFOLIO, REVALIDATE_SECONDS } from '@/constants'

const getPortfolioPageMeta = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'portfolio-page', depth: 1 })
  },
  ['portfolio-page-meta'],
  { revalidate: REVALIDATE_SECONDS },
)

const getPortfolioData = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const [items, categories] = await Promise.all([
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
    return { items: items.docs, categories: categories.docs }
  },
  ['portfolio-page-data'],
  { tags: [CACHE_TAG_PORTFOLIO], revalidate: REVALIDATE_SECONDS },
)

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getPortfolioPageMeta()
  return generateMeta({ doc })
}

export default async function PortfolioPage() {
  const { items, categories } = await getPortfolioData()

  return (
    <div className="pt-16">
      <GalleryGrid items={items} categories={categories} />
    </div>
  )
}
