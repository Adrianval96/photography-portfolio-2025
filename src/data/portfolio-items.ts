import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { CACHE_TAG_PORTFOLIO, REVALIDATE_SECONDS } from '@/constants'

const COLLECTION = 'portfolio-items'
const FEATURED_WORK_LIMIT = 6
const CACHE_KEYS = {
  featured: 'portfolio-items-featured',
  all: 'portfolio-items-all',
} as const

export const fetchFeaturedPortfolioItems = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: COLLECTION,
      where: { featured: { equals: true } },
      limit: FEATURED_WORK_LIMIT,
      depth: 1,
    })
    return docs
  },
  [CACHE_KEYS.featured],
  { tags: [CACHE_TAG_PORTFOLIO], revalidate: REVALIDATE_SECONDS },
)

export const fetchAllPortfolioItems = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: COLLECTION,
      limit: 300,
      pagination: false,
      overrideAccess: false,
      depth: 1,
    })
    return docs
  },
  [CACHE_KEYS.all],
  { tags: [CACHE_TAG_PORTFOLIO], revalidate: REVALIDATE_SECONDS },
)
