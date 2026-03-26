import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { CACHE_TAG_REDIRECTS, REVALIDATE_SECONDS } from '@/constants'

export async function getRedirects(depth = 1) {
  const payload = await getPayload({ config: configPromise })

  const { docs: redirects } = await payload.find({
    collection: CACHE_TAG_REDIRECTS,
    depth,
    limit: 0,
    pagination: false,
  })

  return redirects
}

/**
 * Returns a unstable_cache function mapped with the cache tag for 'redirects'.
 *
 * Cache all redirects together to avoid multiple fetches.
 */
export const getCachedRedirects = () =>
  unstable_cache(async () => getRedirects(), [CACHE_TAG_REDIRECTS], {
    tags: [CACHE_TAG_REDIRECTS],
    revalidate: REVALIDATE_SECONDS,
  })
