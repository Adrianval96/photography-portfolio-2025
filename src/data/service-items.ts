import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { REVALIDATE_SECONDS } from '@/constants'

const CACHE_KEY_SERVICE_ITEMS = 'service-items-all'

export const fetchServiceItems = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'service-items',
      sort: 'order',
    })
    return docs
  },
  [CACHE_KEY_SERVICE_ITEMS],
  { revalidate: REVALIDATE_SECONDS },
)
