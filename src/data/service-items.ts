import { fetchCollectionDocs } from '@/data/helpers'

const COLLECTION = 'service-items'
const CACHE_KEY = 'service-items-all'

export const fetchServiceItems = fetchCollectionDocs(
  COLLECTION,
  CACHE_KEY,
  { sort: 'order' },
)
