import type { Config } from '@/payload-types'
import type { Where } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { REVALIDATE_SECONDS } from '@/constants'

type GlobalSlug = keyof Config['globals']
type CollectionSlug = keyof Config['collections']

type CollectionFetchOptions = {
  depth?: number
  limit?: number
  pagination?: boolean
  overrideAccess?: boolean
  where?: Where
  sort?: string
}

export function fetchFromCMS<S extends GlobalSlug>(slug: S, cacheKey: string, depth = 1) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      return payload.findGlobal({ slug, depth })
    },
    [cacheKey],
    { tags: [`global_${slug}`], revalidate: REVALIDATE_SECONDS },
  )
}

export function fetchCollectionDocs<C extends CollectionSlug>(
  collection: C,
  cacheKey: string,
  options: CollectionFetchOptions = {},
  tags: string[] = [],
) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const { docs } = await payload.find({ collection, ...options })
      return docs
    },
    [cacheKey],
    { tags, revalidate: REVALIDATE_SECONDS },
  )
}
