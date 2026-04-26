import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { CACHE_KEY_CATEGORIES, REVALIDATE_SECONDS } from '@/constants'

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
