import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { REVALIDATE_SECONDS } from '@/constants'

const COLLECTION = 'categories'
const CACHE_KEY = 'categories-all'

export const fetchCategories = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: COLLECTION,
      limit: 100,
      pagination: false,
    })
    return docs
  },
  [CACHE_KEY],
  { revalidate: REVALIDATE_SECONDS },
)
