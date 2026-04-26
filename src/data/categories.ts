import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { REVALIDATE_SECONDS } from '@/constants'

const CACHE_KEY_CATEGORIES = 'categories-all'

export const fetchCategories = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'categories',
      limit: 100,
      pagination: false,
    })
    return docs
  },
  [CACHE_KEY_CATEGORIES],
  { revalidate: REVALIDATE_SECONDS },
)
