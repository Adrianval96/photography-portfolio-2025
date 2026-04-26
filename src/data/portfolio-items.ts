import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { CACHE_TAG_PORTFOLIO, REVALIDATE_SECONDS } from '@/constants'

const FEATURED_WORK_LIMIT = 6
const CACHE_KEY_FEATURED_PORTFOLIO_ITEMS = 'portfolio-items-featured'
const CACHE_KEY_ALL_PORTFOLIO_ITEMS = 'portfolio-items-all'

export const fetchFeaturedPortfolioItems = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'portfolio-items',
      where: { featured: { equals: true } },
      limit: FEATURED_WORK_LIMIT,
      depth: 1,
    })
    return docs
  },
  [CACHE_KEY_FEATURED_PORTFOLIO_ITEMS],
  { tags: [CACHE_TAG_PORTFOLIO], revalidate: REVALIDATE_SECONDS },
)

export const fetchAllPortfolioItems = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'portfolio-items',
      limit: 300,
      pagination: false,
      overrideAccess: false,
      depth: 1,
    })
    return docs
  },
  [CACHE_KEY_ALL_PORTFOLIO_ITEMS],
  { tags: [CACHE_TAG_PORTFOLIO], revalidate: REVALIDATE_SECONDS },
)
