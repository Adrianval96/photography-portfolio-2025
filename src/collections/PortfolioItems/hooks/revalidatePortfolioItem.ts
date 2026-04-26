import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { PortfolioItem } from '../../../payload-types'
import { CACHE_TAG_PORTFOLIO } from '@/constants'

export const revalidatePortfolioItem: CollectionAfterChangeHook<PortfolioItem> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating portfolio cache')
    revalidatePath('/portfolio')
    revalidatePath('/')
    revalidateTag(CACHE_TAG_PORTFOLIO, {})
  }
  return doc
}

export const revalidateDeletePortfolioItem: CollectionAfterDeleteHook<PortfolioItem> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/portfolio')
    revalidatePath('/')
    revalidateTag(CACHE_TAG_PORTFOLIO, {})
  }
  return doc
}
