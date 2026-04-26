import { CACHE_TAG_REDIRECTS } from '@/constants'
import { fetchCollectionDocs } from '@/data/helpers'

const COLLECTION = CACHE_TAG_REDIRECTS

export const fetchRedirects = fetchCollectionDocs(
  COLLECTION,
  CACHE_TAG_REDIRECTS,
  { depth: 1, limit: 0, pagination: false },
  [CACHE_TAG_REDIRECTS],
)
