import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { CACHE_TAG_REDIRECTS, REVALIDATE_SECONDS } from '@/constants'

const COLLECTION = CACHE_TAG_REDIRECTS

export const fetchRedirects = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: COLLECTION,
      depth: 1,
      limit: 0,
      pagination: false,
    })
    return docs
  },
  [CACHE_TAG_REDIRECTS],
  { tags: [CACHE_TAG_REDIRECTS], revalidate: REVALIDATE_SECONDS },
)
