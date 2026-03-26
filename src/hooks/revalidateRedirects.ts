import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { CACHE_TAG_REDIRECTS } from '@/constants'

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating redirects`)

  revalidateTag(CACHE_TAG_REDIRECTS, {})

  return doc
}
