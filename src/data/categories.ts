import { fetchCollectionDocs } from '@/data/helpers'

const COLLECTION = 'categories'
const CACHE_KEY = 'categories-all'

export const fetchCategories = fetchCollectionDocs(
  COLLECTION,
  CACHE_KEY,
  { limit: 100, pagination: false },
)
