import { CACHE_TAG_PORTFOLIO } from '@/constants'
import { fetchCollectionDocs } from '@/data/helpers'

const COLLECTION = 'portfolio-items'
const FEATURED_WORK_LIMIT = 6
const CACHE_KEYS = {
  featured: 'portfolio-items-featured',
  all: 'portfolio-items-all',
} as const

export const fetchFeaturedPortfolioItems = fetchCollectionDocs(
  COLLECTION,
  CACHE_KEYS.featured,
  { where: { featured: { equals: true } }, limit: FEATURED_WORK_LIMIT, depth: 1 },
  [CACHE_TAG_PORTFOLIO],
)

export const fetchAllPortfolioItems = fetchCollectionDocs(
  COLLECTION,
  CACHE_KEYS.all,
  { limit: 300, pagination: false, overrideAccess: false, depth: 1 },
  [CACHE_TAG_PORTFOLIO],
)
