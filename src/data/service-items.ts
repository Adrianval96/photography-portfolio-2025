import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { REVALIDATE_SECONDS } from '@/constants'

const COLLECTION = 'service-items'
const CACHE_KEY = 'service-items-all'

export const fetchServiceItems = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: COLLECTION,
      sort: 'order',
    })
    return docs
  },
  [CACHE_KEY],
  { revalidate: REVALIDATE_SECONDS },
)
