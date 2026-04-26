import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import {
  CACHE_KEY_ALL_PORTFOLIO_ITEMS,
  CACHE_KEY_FEATURED_PORTFOLIO_ITEMS,
  CACHE_TAG_PORTFOLIO,
  FEATURED_WORK_LIMIT,
  REVALIDATE_SECONDS,
} from '@/constants'

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
